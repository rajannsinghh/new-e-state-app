'use client';

import { useState, useEffect, useRef } from 'react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchRef = useRef();

  useEffect(() => {
    fetchProperties();
    searchRef.current?.focus();
  }, []);

  const fetchProperties = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/properties?search=${query}`);
      const data = await res.json();
      if (res.ok) {
        const approvedOnly = data.properties?.filter(p => p.isApproved);
        setProperties(approvedOnly || []);
      } else {
        throw new Error(data.error || 'Failed to load properties');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-brand">Available Properties</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by title or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* Loading & Error */}
      {loading ? (
        <p className="text-center">Loading properties...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : properties.length === 0 ? (
        <p className="text-center">No approved properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p._id} className="border rounded-lg shadow p-4 bg-white">
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold truncate">{p.title}</h3>
              <p className="text-gray-600">{p.location}</p>
              <p className="text-blue-600 font-bold">₹{p.price.toLocaleString()}</p>
              <p className="text-sm mt-2 text-gray-700">
                {p.description.length > 100 ? p.description.slice(0, 100) + '...' : p.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
