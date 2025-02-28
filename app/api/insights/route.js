import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Insight from '@/app/models/Insight';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const insight = await Insight.create(data);
    return NextResponse.json(insight);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const insights = await Insight.find({}).sort({ createdAt: -1 });
    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 