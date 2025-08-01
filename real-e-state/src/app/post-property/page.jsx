"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PostPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewURL(preview);
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImage();
    }

    const res = await fetch("/api/properties/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Property submitted! Waiting for approval.");
      setForm({ title: "", description: "", price: "", location: "" });
    } else {
      setMessage(data.error || "Failed to submit property.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Post a Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
          required
        />
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price (INR)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows="4"
          onChange={handleChange}
          required
        ></textarea>
        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            className="w-full h-48 object-cover rounded mt-2 border"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="text-center text-red-600 mt-4">{message}</p>}
    </div>
  );
}
