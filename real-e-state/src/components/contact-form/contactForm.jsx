'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function ContactForm({ propertyId, ownerEmail }) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message) return toast.error('Message is required')

    const res = await fetch('/api/contact-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId,
        message,
        fromUser: user?.email,
        toUser: ownerEmail,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      toast.success('Message sent!')
      setMessage('')
    } else {
      toast.error(data.error || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl">
      <h3 className="text-lg font-semibold">Send an Inquiry</h3>
      <textarea
        className="w-full p-2 border rounded"
        rows="4"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Message
      </button>
    </form>
  )
}
