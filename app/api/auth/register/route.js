import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    // Prüfe ob User bereits existiert
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Benutzer oder Email existiert bereits' },
        { status: 400 }
      );
    }

    const user = await User.create({
      username,
      email,
      password
    });

    // Nicht das Passwort zurückgeben
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 