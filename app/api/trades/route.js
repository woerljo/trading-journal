import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trade from '@/app/models/Trade';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const trade = await Trade.create(data);
    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const trades = await Trade.find({}).sort({ createdAt: -1 });
    return NextResponse.json(trades);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 