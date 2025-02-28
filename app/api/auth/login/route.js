import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import * as jose from 'jose';

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();
    console.log('Login-Versuch für:', username); // Debug

    // Finde User
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Benutzer nicht gefunden:', username); // Debug
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 401 }
      );
    }

    // Prüfe Passwort
    const isValid = await user.comparePassword(password);
    console.log('Passwort gültig:', isValid); // Debug

    if (!isValid) {
      return NextResponse.json(
        { error: 'Falsches Passwort' },
        { status: 401 }
      );
    }

    // JWT mit jose erstellen
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    console.log('Token erstellt:', token.substring(0, 20) + '...');

    const response = NextResponse.json({ 
      message: 'Login erfolgreich',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

    // Cookie setzen
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 Tage
    });

    console.log('Login erfolgreich, Token gesetzt'); // Debug
    return response;
  } catch (error) {
    console.error('Server Fehler:', error); // Debug
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 