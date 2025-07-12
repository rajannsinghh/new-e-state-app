'use client';

import { useEffect, useState } from 'react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch('/api/properties/approved');
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
      }
      setLoading(false);
    };
    fetchProperties();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Properties</h1>
      {properties.length === 0 ? (
        <p className="text-center">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="border rounded p-4 shadow hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p><b>Location:</b> {p.location}</p>
              <p><b>Price:</b> ₹{p.price}</p>
              <p className="text-sm text-gray-600 mt-2">{p.description.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
