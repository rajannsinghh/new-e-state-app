'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMyProperties = async () => {
      const res = await fetch('/api/properties/my');
      const data = await res.json();

      if (res.ok) {
        setProperties(data.properties);
      } else {
        setMessage(data.error || 'Failed to load');
      }
      setLoading(false);
    };

    fetchMyProperties();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">My Listings</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-center">You haven’t submitted any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((p) => (
            <div key={p._id} className="border p-4 rounded bg-white shadow">
              {p.images?.[0] && (
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  width={400}
                  height={160}
                  className="rounded mb-2 w-full object-cover h-40"
                />
              )}
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{p.location}</p>
              <p className="text-blue-600 font-bold text-sm mb-1">₹{p.price}</p>
              <p className="text-xs text-gray-700 mb-1">{p.description.slice(0, 80)}...</p>
              <p className={`text-xs font-semibold ${p.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                Status: {p.isApproved ? 'Approved' : 'Pending'}
              </p>
            </div>
          ))}
        </div>
      )}
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
