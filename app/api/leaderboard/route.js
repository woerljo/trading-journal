import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Leaderboard from '@/models/Leaderboard';
import Trade from '@/models/Trade';

export async function GET() {
  try {
    await connectDB();
    
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();

    const leaderboard = await Leaderboard.find({ 
      weekNumber, 
      year 
    }).sort({ weeklyProfit: -1 }).limit(3);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}