'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function ContactForm({ propertyId, adminEmail }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to send a message');
      return;
    }

    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          message: message.trim(),
          fromUser: user.email,
          toUser: adminEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setMessage('');
    } catch (error) {
      toast.error(error.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border border-gray-300 rounded-xl bg-white"
    >
      <h3 className="text-lg font-semibold">Send an Inquiry</h3>
      <label htmlFor="message" className="sr-only">
        Message
      </label>
      <textarea
        id="message"
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
