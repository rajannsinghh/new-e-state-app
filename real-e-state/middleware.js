import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next(); // Token valid, allow access
  } catch (err) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Protect these routes only
export const config = {
  matcher: ['/post-property', '/profile', '/listing'],
};
