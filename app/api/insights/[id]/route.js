import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Insight from '@/app/models/Insight';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedInsight = await Insight.findByIdAndDelete(id);
    
    if (!deletedInsight) {
      return NextResponse.json(
        { error: 'Erkenntnis nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deletedInsight);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 