import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Insight from '@/app/models/Insight';

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

    const insights = await Insight.find({ userId });
    return NextResponse.json(insights);
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
    const insight = await Insight.create({ ...data, userId });
    return NextResponse.json(insight);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 