'use client';

import { useEffect, useState } from 'react';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">My Submitted Properties</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-center">You haven’t submitted any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow-sm">
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
              <p className={`mt-2 text-sm font-semibold ${p.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
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
