'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './nav.css';
import ModalAuth from '@/components/modals/page.jsx';

export default function Navbar() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const { user, loading } = useAuth();
  const [scroll, setScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = user?.email === adminEmail;
  const profileLink = isAdmin ? "/dashboard" : "/user-dashboard";

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedClick = (path) => {
    if (!user) {
      setRedirectPath(path);
      setAuthModalOpen(true);
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scroll > 100 ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-brand text-2xl font-bold">
            Estate<span className="color-b">Agency</span>
          </Link>

          <button className="md:hidden text-xl" onClick={() => setShowSearch(true)}>
            <i className="bi bi-search"></i>
          </button>

          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <ul className="hidden md:flex items-center gap-6">
            <li><Link href="/" className="link-a">Home</Link></li>
            <li><Link href="/properties" className="link-a">Properties</Link></li>
            <li>
              <button onClick={() => handleProtectedClick("/listing-properties")} className="link-a">
                My Listings
              </button>
            </li>
            <li>
              <button onClick={() => handleProtectedClick(profileLink)}>
                <img
                  title="Profile"
                  src={user?.avatar || '/default-avatar.png'}
                  alt="avatar"
                  className="w-8 h-8 cursor-pointer transition hover:scale-105"
                />
              </button>
            </li>
            <li>
              <button onClick={() => handleProtectedClick("/post-property")} className="link-a btn btn-b text-sm px-4 py-2">
                Create a Listings
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md p-4 flex flex-col gap-4">
            <Link href="/" className="link-a" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/properties" className="link-a" onClick={() => setMenuOpen(false)}>Properties</Link>
            <button onClick={() => { setMenuOpen(false); handleProtectedClick("/listing-properties"); }} className="link-a">My Listings</button>
            <button onClick={() => { setMenuOpen(false); handleProtectedClick("/post-property"); }} className="link-a">Post Property</button>
            <button onClick={() => { setMenuOpen(false); handleProtectedClick(profileLink); }}>
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt="avatar"
              />
            </button>
          </div>
        )}
      </nav>

      {/* Sidebar Search */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white p-6 z-50 transition-transform duration-300 ease-in-out ${showSearch ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Search</h2>
          <button onClick={() => setShowSearch(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Search..." className="p-2 border rounded focus:outline-none" />
          <button type="submit" className="btn btn-b">Search</button>
        </form>
      </div>

      {/* Backdrop */}
      {showSearch && (
        <div
          onClick={() => setShowSearch(false)}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Login/Signup Modal */}
      <ModalAuth show={authModalOpen} onClose={() => setAuthModalOpen(false)} redirectTo={redirectPath} />
    </>
  );
}
