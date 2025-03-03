import { connectDB } from '@/app/lib/mongodb';
import Goal from '@/app/models/Goal';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const goal = await Goal.create(data);
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const goals = await Goal.find({}).sort({ createdAt: -1 });
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 