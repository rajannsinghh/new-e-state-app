'use client';

import { useEffect, useState } from 'react';

export default function OwnerDashboard() {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch('/api/owner/pending');
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
      } else {
        setMessage(data.error || 'Failed to load');
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id, approve) => {
    const res = await fetch('/api/owner/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approve }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Pending Properties</h2>
      {properties.length === 0 && <p>No pending properties</p>}
      {properties.map((property) => (
        <div key={property._id} className="border p-4 rounded mb-4">
          <h3 className="text-lg font-semibold">{property.title}</h3>
          <p><b>Location:</b> {property.location}</p>
          <p><b>Price:</b> ₹{property.price}</p>
          <p><b>Description:</b> {property.description}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleAction(property._id, true)}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(property._id, false)}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
      {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
    </div>
  );
}
