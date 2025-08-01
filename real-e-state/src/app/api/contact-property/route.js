import { sendEmail } from '@/lib/mailer'
import { connectDB } from '@/lib/db'
import { Property } from '@/models/Property'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { propertyId, message, fromUser, toUser } = await req.json()
    await connectDB()

    const property = await Property.findById(propertyId)
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const html = `
      <p>You have a new inquiry for your property: <strong>${property.title}</strong></p>
      <p><strong>From:</strong> ${fromUser}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `

    await sendEmail({
      to: toUser || process.env.OWNER_EMAIL,
      subject: 'New Property Inquiry',
      html,
    })

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
