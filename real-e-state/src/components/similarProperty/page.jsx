"use client";

import Link from "next/link";

export default function SimilarProperties({ similar }) {
  if (!similar?.length) return null;

  return (
    <aside className="bg-white p-4 rounded-xl shadow h-fit w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Similar Properties</h2>
      <div className="space-y-4">
        {similar.map((sp) => (
          <Link key={sp._id} href={`/properties/${sp._id}`} className="block group">
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
              <img
                src={sp.images?.[0]}
                className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                alt={sp.title}
              />
              <div className="p-2">
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">{sp.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{sp.location}</p>
                <p className="text-blue-600 text-sm font-bold mt-1">₹{sp.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
