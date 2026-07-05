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
    let roles: string[] = [];
    try {
      if (userCookie) {
        const user = JSON.parse(userCookie);
        roles = user.roles || [];
      }
    } catch (e) { }

    if (roles.includes('super_admin')) {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    } else if (roles.includes('admin')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    } else if (roles.includes('teacher')) {
      return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
    } else if (roles.includes('parent')) {
      return NextResponse.redirect(new URL('/portal/parent', request.url));
    } else if (roles.includes('student')) {
      return NextResponse.redirect(new URL('/portal/student', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/school-admin/:path*', '/portal/:path*', '/login'],
};
