'use client'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    setMessage(data.message || data.error)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-2 border mb-3 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="otp"
          placeholder="OTP"
          required
          className="w-full p-2 border mb-3 rounded"
          value={form.otp}
          onChange={handleChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          required
          className="w-full p-2 border mb-3 rounded"
          value={form.newPassword}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  )
}
