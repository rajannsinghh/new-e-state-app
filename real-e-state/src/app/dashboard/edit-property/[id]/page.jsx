'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', price: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      const res = await fetch(`/api/my-properties/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data.property);
        setForm({
          title: data.property.title,
          description: data.property.description,
          location: data.property.location,
          price: data.property.price,
        });
      } else {
        toast.error('Unauthorized or not found');
        router.push('/dashboard/my-properties');
      }
      setLoading(false);
    }

    fetchProperty();
  }, [id, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`/api/my-properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success('Property updated');
      setTimeout(() => router.push('/dashboard/my-properties'), 1500);
    } else {
      toast.error('Failed to update');
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;

  if (property.status === 'approved') {
    return <p className="p-4 text-red-600">Approved properties cannot be edited.</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <Link href="/dashboard/my-properties" className="text-blue-600 hover:underline text-sm">
          ← Back to My Properties
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Property
        </button>
      </form>
    </div>
  );
}
