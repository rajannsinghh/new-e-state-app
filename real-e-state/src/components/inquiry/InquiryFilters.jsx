// components/InquiryFilters.jsx
'use client';
import { useState } from 'react';

export default function InquiryFilters({ onFilter }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [property, setProperty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ from: fromDate, to: toDate, property });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border p-2 rounded"
        placeholder="From date"
      />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border p-2 rounded"
        placeholder="To date"
      />
      <input
        type="text"
        value={property}
        onChange={(e) => setProperty(e.target.value)}
        className="border p-2 rounded"
        placeholder="Property name or ID"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Apply Filters
      </button>
    </form>
  );
}
