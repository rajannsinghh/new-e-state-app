'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '@/components/modals/page.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const router = useRouter();

  const fetchUser = async (signal) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        signal,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }

      const data = await res.json();

      const role = data.user.role || (data.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user');

      setUser({
        ...data.user,
        role,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Auth fetch error:', err.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.push('/auth/login');
    }
  };

  // 
  const updateUserContext = (updatedUser) => {
    const role = updatedUser.role || (updatedUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'admin' : 'user');
    setUser({ ...updatedUser, role });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        setUser,
        updateUserContext,
        openLoginModal,
      }}
    >
      {children}
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
