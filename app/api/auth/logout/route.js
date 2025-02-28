import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout erfolgreich' });
  
  response.cookies.delete('token');
  
  return response;
} 