import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Trade from '@/app/models/Trade';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deletedTrade = await Trade.findByIdAndDelete(id);
    
    if (!deletedTrade) {
      return NextResponse.json(
        { error: 'Trade nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deletedTrade);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 