'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function InquiryForm({ propertyId }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, propertyId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="border p-2 w-full" />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="border p-2 w-full" />
      <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Send Inquiry</button>
    </form>
  );
}
