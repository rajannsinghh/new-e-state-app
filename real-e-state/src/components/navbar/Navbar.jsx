'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <div className="text-xl font-bold">
        <Link href="/">E-State</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/properties">Listings</Link>

        {!loading && user && (
          <>
            <Link href="/post-property">Post Property</Link>
            <Link href="/profile">Profile</Link>
          </>
        )}

        {!loading && !user && (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
