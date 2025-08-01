'use client';
import { useEffect, useState } from 'react';
import InquiryFilters from '@/components/InquiryFilters';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.property) params.append('property', filters.property);

      const res = await fetch(`/api/inquiry/get?${params.toString()}`);
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (error) {
      console.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Message', 'Property ID', 'Created At'];
    const rows = inquiries.map(i => [
      `"${i.name}"`,
      `"${i.email}"`,
      `"${i.message}"`,
      `"${i.propertyId}"`,
      `"${new Date(i.createdAt).toLocaleString()}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inquiries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download CSV
        </button>
      </div>

      {/* ✅ Filter Component */}
      <InquiryFilters onFilter={fetchInquiries} />

      {loading ? (
        <p className="p-4">Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inquiry => (
            <div key={inquiry._id} className="p-4 border rounded shadow">
              <p><strong>Name:</strong> {inquiry.name}</p>
              <p><strong>Email:</strong> {inquiry.email}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
              <p><strong>Property ID:</strong> {inquiry.propertyId}</p>
              <p className="text-sm text-gray-500"><strong>Date:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
