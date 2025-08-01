
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError('You must be logged in');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-xl text-center">
      <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
      <p className="text-gray-600">Email: {user.email}</p>
      <p className="text-gray-600">Role: {user.role || 'user'}</p>
    </div>
  );
}
