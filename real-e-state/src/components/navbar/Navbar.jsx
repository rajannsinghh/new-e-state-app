'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import './nav.css';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-default navbar-expand-lg fixed-top ${
        scroll > 100 ? 'navbar-reduce' : 'navbar-trans'
      }`}
    >
      <div className="container flex justify-between items-center gap-4">
        {/* Logo */}
        <Link className="navbar-brand text-brand text-2xl font-bold" href="/">
          Estate<span className="color-b">Agency</span>
        </Link>

        {/* Search box */}
        <form action="" className="bg-slate-100 p-2 rounded-lg flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <i className="bi bi-search" />
          </button>
        </form>

        {/* Navbar links */}
        <ul className="navbar-nav flex-row gap-4 items-center">
          <li className="navbar-item">
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li className="navbar-item">
                <Link href="/dashboard/post-property" className="nav-link">
                  Post Property
                </Link>
              </li>
              <li className="navbar-item">
                <Link href="/properties/" className="nav-link">
                  Properties
                </Link>
              </li>
              <li className="navbar-item">
                <Link href="/dashboard/my-properties" className="nav-link">
                  My Listings
                </Link>
              </li>
              <li className="navbar-item">
                <Link href="/dashboard/profile">
                  <img
                    src="/default-avatar.png"
                    className="w-8 h-8 rounded-full border object-cover"
                    alt="Avatar"
                  />
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link href="/auth/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-3 py-1 rounded-2xl hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
