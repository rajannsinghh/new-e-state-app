"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDashboard() {
  const { user, logout, loading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user]);

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch("/api/properties/my");
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
      } else {
        setMessage(data.error || "Failed to load properties");
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this property?")) return;
    const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert("Failed to delete");
    }
  };

  if (loading || !user) return <p className="mt-20 text-center">Loading...</p>;

  return (
    <main className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4 text-brand">
        Welcome, {user.name}
      </h1>

      {/* Profile Info */}
      <section className="bg-white shadow rounded p-4 mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            width={96}
            height={96}
            className="rounded-full object-cover "
          />
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push("/edit-profile")}
            className="btn btn-b px-4 py-1 text-sm"
          >
            Edit Profile
          </button>
          <button
            onClick={async () => {
              await logout();
              router.push("/auth/login");
            }}
            className="btn btn-a px-4 py-1 text-sm"
          >
            Logout
          </button>
        </div>
      </section>

      {/* Properties */}
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">My Properties</h2>
        {properties.length === 0 ? (
          <p>No properties posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div key={p._id} className="border p-4 rounded">
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="h-40 w-full object-cover mb-2 rounded"
                  />
                )}
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.location}</p>
                <p className="text-blue-600 font-bold text-sm">₹{p.price}</p>
                <p className="text-xs mt-1">
                  Status:{" "}
                  <span
                    className={
                      p.isApproved ? "text-green-600" : "text-yellow-500"
                    }
                  >
                    {p.isApproved ? "Approved" : "Pending"}
                  </span>
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/edit-property/${p._id}`)}
                    className="btn btn-b px-3 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-a px-3 py-1 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
    </main>
  );
}
