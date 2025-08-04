'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [fetching, setFetching] = useState(true);
  const {user, loading} = useAuth()
  const router = useRouter

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if(!user) return
    async function fetchMyProperties() {
     try {
       const res = await fetch('/api/my-properties',{
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }else{
        toast.error('Unauthorized or error fetching properties')
      }
     } catch (error) {
      console.log(error);
      toast.error('Error loading properties')
     } finally {
      setFetching(false)
     }
    }

    fetchMyProperties();
  }, [user]);

  if (loading || fetching) return <p className="p-4">Loading your properties...</p>;

  async function handleDelete(propertyId) {
    const confirm = window.confirm('Are you sure you want to delete this property')
    if(!confirm) return

    try {
        const res = await fetch(`/api/properties/${propertyId}`,{
            method: 'DELETE',
            credentials: 'include',
        })
        if(res.ok){
            toast.success('Property deleted');
            setProperties((prev) => prev.filter((p) => p._id !== propertyId))
        }else {
            toast.error('Failed to deleted')
        }
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>

      {properties.length === 0 ? (
        <p>No properties submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="mt-2">{property.description.slice(0, 100)}...</p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    property.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {property.status}
                </span>

                {property.status !== 'approval' && (
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/edit-property/${property._id}`} className='text-blue-600 text-sm'>Edit</Link>
                        <button onClick={() => handleDelete(property._id)} className='text-red-600 text-sm'>Delete</button>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
