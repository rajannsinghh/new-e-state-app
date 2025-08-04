"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ContactForm from "@/components/contact-form/page.jsx";
import SimilarProperties from "@/components/similarProperty/page.jsx";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (res.ok) setProperty(data.property);
        else setError(data.error || "Property not found");
      } catch (err) {
        setError("Something went wrong.");
      }
    };
    if (id) fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      const res = await fetch(`/api/properties/similar/${id}`);
      const data = await res.json();
      if (res.ok) setSimilar(data.similar || []);
    };
    if (id) fetchSimilar();
  }, [id]);

  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;
  if (!property) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 animate-fade-in">
      {/* Property Details Section */}
      <div className="bg-white p-6 rounded shadow">
        {/* Cover Image */}
        {property.cover && (
          <img
            src={property.cover}
            alt={property.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        {/* Image Carousel */}
        <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-2">
          {property.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={property.alts?.[i] || `Image ${i + 1}`}
              className="w-64 h-40 object-cover rounded snap-start shrink-0"
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold mt-4 mb-2">{property.title}</h1>
        <p className="text-gray-600 mb-2">
          <b>Location:</b> {property.location}
        </p>
        <p className="text-blue-700 font-bold text-xl mb-2">
          ₹{property.price}
        </p>
        <p className="mb-4">{property.description}</p>

        {/* Detailed Property Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-700 mb-6">
          <p><b>Bedrooms:</b> {property.bedrooms}</p>
          <p><b>Bathrooms:</b> {property.bathrooms}</p>
          <p><b>Balconies:</b> {property.balconies}</p>
          <p><b>Furnishing:</b> {property.furnishingStatus}</p>
          <p><b>Toilets:</b> {property.toilet}</p>
          <p><b>Ownership:</b> {property.ownershipType}</p>
          <p><b>Availability:</b> {property.availability}</p>
          <p><b>Age:</b> {property.ageOfProperty}</p>
          <p><b>Total Floors:</b> {property.totalFloors}</p>
          <p><b>On Floor:</b> {property.propertyOnThisFloor}</p>
          <p><b>Parking:</b> {property.reservedParking}</p>
          <p><b>Amenities:</b> {property.ameneties}</p>
        </div>

        <p className="text-sm text-gray-500">
          Posted by: {property.postedBy?.name} ({property.postedBy?.email})
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Date Posted: {new Date(property.createdAt).toLocaleDateString()}
        </p>

        {/* Contact Form */}
        <div className="border rounded-lg p-4 shadow bg-gray-50">
          <ContactForm
            propertyId={property._id}
            ownerEmail={property.postedBy.email}
            title={property.title}
          />
        </div>

        {/* Go Back */}
        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          ← Go Back
        </button>
      </div>

      {/* Sidebar: Similar Properties */}
      <aside className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Similar Properties</h2>
        <SimilarProperties similar={similar} />
      </aside>
    </div>
  );
}
