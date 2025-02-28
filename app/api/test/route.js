import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'success', message: 'Verbindung zur Datenbank erfolgreich!' });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Verbindung fehlgeschlagen: ' + error.message },
      { status: 500 }
    );
  }
} 