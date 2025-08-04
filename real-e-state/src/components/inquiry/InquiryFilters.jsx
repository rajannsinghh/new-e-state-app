'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function InquiryFilters({ onFilter }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [property, setProperty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromDate && !toDate && !property) {
      toast.error('Please enter at least one filter.');
      return;
    }

    onFilter({ from: fromDate, to: toDate, property });
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setProperty('');
    onFilter({ from: '', to: '', property: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">From Date</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600">To Date</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col flex-1">
        <label className="text-sm text-gray-600">Property Name or ID</label>
        <input
          type="text"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          placeholder="Property name or ID"
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border px-4 py-2 rounded hover:bg-gray-200"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
