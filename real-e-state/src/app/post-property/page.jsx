"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import React from "react";

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PostPropertyPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    location: "",
    pincode: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    furnishingStatus: "",
    totalFloors: "",
    propertyOnThisFloor: "",
    reservedParking: "",
    availability: "",
    ageOfProperty: "",
    ownershipType: "",
    ameneties: "",
    toilet: "",
    options: {
      sale: false,
      rent: false,
      parking: false,
      furnished: false,
      offer: false,
    },
  });

  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [uploadedURLs, setUploadedURLs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [altTexts, setAltTexts] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user]);

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    const validImages = selected.filter(
      (file) =>
        file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024 &&
        ALLOWED_TYPES.includes(file.type)
    );

    if (validImages.length < selected.length) {
      setMessage(`Some files were skipped due to type/size limits.`);
    }

    const newImages = [...images, ...validImages].slice(0, MAX_IMAGES);
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImages(newImages);
    setPreviewURLs(newPreviews);
    setUploadedURLs(Array(newImages.length).fill(""));
    setAltTexts(Array(newImages.length).fill(""));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewURLs];
    const newUploaded = [...uploadedURLs];
    const newAlts = [...altTexts];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    newUploaded.splice(index, 1);
    newAlts.splice(index, 1);
    setImages(newImages);
    setPreviewURLs(newPreviews);
    setUploadedURLs(newUploaded);
    setAltTexts(newAlts);
    if (coverIndex >= newImages.length) {
      setCoverIndex(0);
    }
  };

  useEffect(() => {
    return () => {
      previewURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewURLs]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({
        ...form,
        options: {
          ...form.options,
          [name]: checked,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadAllImages = async () => {
    setUploading(true);
    let completed = 0;
    const total = images.length;
    const uploaded = await Promise.all(
      images.map(async (image, idx) => {
        const formData = new FormData();
        formData.append("file", image);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
        return data.url;
      })
    );
    setUploadedURLs(uploaded);
    setUploading(false);
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "location",
      "pincode",
      "bedrooms",
      "bathrooms",
      "balconies",
      "furnishingStatus",
      "totalFloors",
      "propertyOnThisFloor",
      "reservedParking",
      "availability",
      "ageOfProperty",
      "ownershipType",
      "ameneties",
      "toilet",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        setMessage("Please fill in all required fields.");
        return false;
      }
    }

    if (uploadedURLs.length === 0 || uploadedURLs.includes("")) {
      setMessage("Please upload all selected images.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (uploadedURLs.length === 0) {
      await uploadAllImages();
    }

    if (!validateForm()) return;

    const payload = {
      ...form,
      price: parseFloat(form.price),
      discountPrice: parseFloat(form.discountPrice) || 0,
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      images: uploadedURLs,
      cover: uploadedURLs[coverIndex],
      alts: altTexts,
    };

    const res = await fetch("/api/properties/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Property submitted! Redirecting...");
      setTimeout(() => router.push("/listing-properties"), 2000);
    } else {
      setMessage(data.error || "Failed to submit property.");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded mt-[100px]">
      <h1 className="text-3xl font-bold mb-6 text-center text-brand">
        Post a Property
      </h1>

      
    </main>
  );
};

export default PostPropertyPage;
