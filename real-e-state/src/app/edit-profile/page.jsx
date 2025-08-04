'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // import useAuth

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const router = useRouter();
  const { user, updateUserContext } = useAuth(); // use global auth
  const [localUser, setLocalUser] = useState(null); // for displaying updated view

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        setLocalUser(data.user); // just for preview
      } catch (err) {
        setError('You must be logged in');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append('avatar', avatar);

    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      updateUserContext(data.user); // globally update avatar
      setLocalUser(data.user); // locally show updated avatar
      setPreview(null);
      setAvatar(null);
    } else {
      alert(data.error || 'Upload failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-xl text-center space-y-4">
      <h2 className="text-2xl font-bold">Welcome, {localUser?.name}!</h2>
      <img
        src={preview || localUser?.avatar || '/default-avatar.png'}
        alt="avatar"
        className="w-24 h-24 rounded-full mx-auto object-cover"
      />
      <input type="file" onChange={handleImageChange} className="block w-full mt-2" />
      {avatar && (
        <button
          onClick={handleUpload}
          className="btn btn-b text-sm mt-2"
        >
          Upload Avatar
        </button>
      )}
      <p className="text-gray-600">Email: {localUser?.email}</p>
      <p className="text-gray-600">Role: {localUser?.role || 'user'}</p>
      <p className="text-gray-600">Joined: {new Date(localUser?.createdAt).toLocaleDateString()}</p>
      <div className="mt-4 flex justify-center gap-4">
        <button onClick={() => router.push('/edit-profile')} className="btn btn-b text-sm px-4 py-2">Edit Profile</button>
      </div>
    </div>
  );
}
