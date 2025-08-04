import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // ✅ Use `jose`, not `jsonwebtoken`

const adminEmails = ['rajans7902@gmail.com']; // ✅ Only these can access /dashboard

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const pathname = request.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith('/dashboard');
    const isPostPropertyRoute = pathname === '/post-property';

    // ❌ If user is blocked, redirect to /blocked
    if (payload.isBlocked) {
      return NextResponse.redirect(new URL('/blocked', request.url));
    }

    // 🔐 Block dashboard for non-admins
    if (isAdminRoute && !adminEmails.includes(payload.email)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // 🔐 Block post-property for blocked users
    if (isPostPropertyRoute && payload.isBlocked) {
      return NextResponse.redirect(new URL('/blocked', request.url));
    }

    return NextResponse.next(); // ✅ Allow access
  } catch (err) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/post-property',
    '/profile',
    '/listing',
    '/owner/dashboard',
    '/dashboard/:path*',
  ],
};
