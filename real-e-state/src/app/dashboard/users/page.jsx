'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const result = users.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase()) ||
      user.email.toLowerCase().includes(text.toLowerCase()) ||
      user.role.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  const toggleBlock = async (id, currentStatus) => {
  const confirmText = currentStatus
    ? 'Unblock this user?'
    : 'Block this user?';

  if (confirm(confirmText)) {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: !currentStatus }),
    });

    setUsers(prev => prev.map(user =>
      user._id === id ? { ...user, isBlocked: !currentStatus } : user
    ));

    setFiltered(prev => prev.map(user =>
      user._id === id ? { ...user, isBlocked: !currentStatus } : user
    ));
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={e => handleSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Avatar</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u._id} className="border-t">
              <td className="p-2">
                <img src={u.avatar || '/avatar.png'} alt="avatar" className="h-8 w-8 rounded-full" />
              </td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role}</td>
              <td className="p-2 space-x-2">
                <Link href={`/dashboard/users/${u._id}`} className="text-blue-600 hover:underline">Edit</Link>
                <button onClick={() => toggleBlock(u._id, u.isBlocked)} className={`${u.isblocked ? 'text-green-600':'text-red-600'} hover:underline`}>{u.isBlocked ? 'Unblock':'Block'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
