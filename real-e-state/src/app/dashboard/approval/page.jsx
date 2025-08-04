'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ApprovalDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)) {
      router.push('/');
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch('/api/properties/pending');
      const data = await res.json();
      if (res.ok) setProperties(data.properties);
      else setMessage(data.error || 'Error fetching properties');
    };
    fetchPending();
  }, []);

  const handleAction = async (id, approve) => {
    const res = await fetch('/api/properties/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approve }),
    });
    const data = await res.json();
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } else {
      setMessage(data.error);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Pending Property Approvals</h2>
      {message && <p className="text-red-600 text-center mb-4">{message}</p>}

      {properties.length === 0 ? (
        <p className="text-center">No pending properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-gray-600">{p.location}</p>
              <p className="text-blue-600 font-bold">₹{p.price}</p>
              <p className="text-sm mt-2">{p.description.slice(0, 80)}...</p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleAction(p._id, false)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(p._id, true)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
