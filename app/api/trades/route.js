import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trade from '@/app/models/Trade';

export async function GET(request) {
  try {
    await connectDB();
    const userId = request.headers.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Alle Trades zurückgeben (keine Filterung)
    const trades = await Trade.find({ userId });

    return NextResponse.json(trades);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = request.headers.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const trade = await Trade.create({ ...data, userId });
    return NextResponse.json(trade);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 