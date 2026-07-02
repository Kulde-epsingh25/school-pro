import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/school-admin', '/portal'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login
  if (pathname === '/login' && token) {
    const userCookie = request.cookies.get('user_session')?.value;
    let role = '';
    try {
      if (userCookie) {
        const user = JSON.parse(userCookie);
        role = user.role;
      }
    } catch (e) { }

    if (role === 'super_admin') {
      return NextResponse.redirect(new URL('/school-onboarding', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/school-admin/:path*', '/portal/:path*', '/login'],
};
