'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ContactForm from '@/components/contact-form/contactForm';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await fetch(`/api/properties/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProperty(data.property);
      } else {
        setError(data.error || 'Property not found');
      }
    };
    fetchProperty();
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!property) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      {property.images?.[0] && (
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-600 mb-2"><b>Location:</b> {property.location}</p>
      <p className="text-blue-700 font-bold text-xl mb-2">₹{property.price}</p>
      <p className="mb-4">{property.description}</p>
      <p className="text-sm text-gray-500">Posted by: {property.postedBy?.name} ({property.postedBy?.email})</p>

      <ContactForm propertyId={property._id} ownerEmail={property.postedBy.email}/>
    </div>
  );
}
