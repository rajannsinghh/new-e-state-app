"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch("/api/properties");
      const data = await res.json();
      if (res.ok) setProperties(data.properties.slice(0, 6)); // only show top 6
    };

    fetchProperties();
  }, []);

  return (
    <main className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand mb-4">
          Find Your Dream Property
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Discover the best properties across your city. Buy, Sell, or Rent.
        </p>
        <Link
          href="/properties"
          className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-full text-lg transition"
        >
          Browse Properties
        </Link>
      </section>

      {/* Featured Properties */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                {property.images?.[0] && (
                  <Image
                    src={property.cover || property.images?.[0] || '/default-property.png' }
                    alt={property.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {property.location}
                  </p>
                  <p className="font-bold text-brand mb-2">₹{property.price}</p>
                  <Link
                    href={`/properties/${property._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
