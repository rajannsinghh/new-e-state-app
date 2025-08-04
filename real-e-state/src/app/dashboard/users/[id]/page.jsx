'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(setUser);
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    router.push('/dashboard/users');
  };

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Edit User</h2>
      <input
        value={user.name}
        onChange={e => setUser({ ...user, name: e.target.value })}
        className="w-full border p-2"
      />
      <select
        value={user.role}
        onChange={e => setUser({ ...user, role: e.target.value })}
        className="w-full border p-2"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="owner">Owner</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
