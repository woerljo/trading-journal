import { NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth';

export async function middleware(request) {
  console.log('Middleware ausgeführt für:', request.nextUrl.pathname);
  
  // Öffentliche Routen
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/register')) {
    console.log('Öffentliche Route, erlaube Zugriff');
    return NextResponse.next();
  }

  const token = request.cookies.get('token');
  console.log('Token gefunden:', !!token, 'Token:', token?.value?.substring(0, 20) + '...');

  if (!token) {
    console.log('Kein Token - Weiterleitung zu /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = await verifyToken(token.value);
    console.log('Token erfolgreich verifiziert:', decoded);
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', decoded.userId);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Prüfe ob der Token bald abläuft und erneuere ihn ggf.
    if (decoded.exp && decoded.exp - Date.now() / 1000 < 60 * 60) {
      console.log('Token wird erneuert');
      // Token-Erneuerung hier...
    }

    return response;
  } catch (error) {
    console.log('Token ungültig:', error);
    // Lösche den ungültigen Token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/',
    '/journal/:path*',
    '/api/trades/:path*',
    '/api/insights/:path*'
  ]
}; 