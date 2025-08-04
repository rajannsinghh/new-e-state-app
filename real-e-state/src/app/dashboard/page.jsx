// src/app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("pending");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!loading && (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)) {
      router.push("/");
    } else {
      fetchProperties();
    }
  }, [user, loading]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties/all");
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties);
      } else {
        setMessage(data.error || "Failed to load properties");
      }
    } catch (error) {
      setMessage("Error loading properties");
    }
  };

  const handleApprove = async (id) => {
    const res = await fetch("/api/properties/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approve: true })
    });
    if (res.ok) fetchProperties();
  };

  const handleReject = async (id) => {
    const res = await fetch("/api/properties/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approve: false })
    });
    if (res.ok) fetchProperties();
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setEditData(property);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/properties/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    });
    if (res.ok) {
      setEditingId(null);
      fetchProperties();
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === "approved") return p.isApproved;
    return !p.isApproved; // pending
  });

  return (
    <div className="max-w-6xl mx-auto mt-20 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFilter("pending")} className={`btn ${filter === "pending" ? "btn-a" : "btn-b"}`}>Pending</button>
        <button onClick={() => setFilter("approved")} className={`btn ${filter === "approved" ? "btn-a" : "btn-b"}`}>Approved</button>
      </div>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th>Image</th>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((p) => (
              <tr key={p._id} className="border-b">
                <td>
                  <img
                    src={p.images?.[0] || "/placeholder.jpg"}
                    alt={p.title}
                    className="w-20 h-14 object-cover"
                  />
                </td>
                <td>
                  {editingId === p._id ? (
                    <input name="title" value={editData.title} onChange={handleEditChange} />
                  ) : (
                    p.title
                  )}
                </td>
                <td>
                  {editingId === p._id ? (
                    <input name="location" value={editData.location} onChange={handleEditChange} />
                  ) : (
                    p.location
                  )}
                </td>
                <td>
                  {editingId === p._id ? (
                    <input name="price" value={editData.price} onChange={handleEditChange} />
                  ) : (
                    `₹${p.price}`
                  )}
                </td>
                <td>{p.postedBy?.email || "Unknown"}</td>
                <td className="flex gap-2 flex-wrap">
                  {editingId === p._id ? (
                    <>
                      <button onClick={handleUpdate} className="bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleApprove(p._id)} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                      <button onClick={() => handleReject(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                      <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
