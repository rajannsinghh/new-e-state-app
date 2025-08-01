'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-6">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-200 text-indigo-900 py-2 rounded-full font-semibold hover:bg-indigo-300 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'GET STARTED NOW'}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-red-600">{message}</p>
        )}

        <p className="text-xs text-center text-gray-500 mt-6">
          By clicking the "Get Started" button, you agree to our{' '}
          <a href="#" className="text-indigo-500 underline">Terms of Service</a> and{' '}
          <a href="#" className="text-indigo-500 underline">Privacy Policy</a>.
        </p>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/auth/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
