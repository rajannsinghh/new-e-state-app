'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PostPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', price: '', location: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/properties/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Property submitted! Waiting for approval.');
      setForm({ title: '', description: '', price: '', location: '' });
    } else {
      setMessage(data.error || 'Failed to submit property.');
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Post a Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="location" placeholder="Location" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price (INR)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" rows="4" onChange={handleChange} required></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
      {message && <p className="text-center text-red-600 mt-4">{message}</p>}
    </div>
  );
}
