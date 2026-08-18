import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/dashboard', '/school-admin', '/portal', '/admin', '/saas-admin', '/tenant'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based protection for authenticated users
  if (token) {
    const userCookie = request.cookies.get('user_session')?.value;
    let roles: string[] = [];
    try {
      if (userCookie) {
        const user = JSON.parse(userCookie);
        roles = user.roles || [];
      }
    } catch (e) { }

    // Strictly enforce SaaS Admin path protection: Only saas_super_admin allowed
    if (pathname.startsWith('/saas-admin') && !roles.includes('saas_super_admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect authenticated users away from login page
    if (pathname === '/login') {
      if (roles.includes('saas_super_admin')) {
        return NextResponse.redirect(new URL('/saas-admin', request.url));
      } else if (roles.includes('super_admin')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/school-admin/:path*', '/portal/:path*', '/saas-admin/:path*', '/admin/:path*', '/login'],
};
