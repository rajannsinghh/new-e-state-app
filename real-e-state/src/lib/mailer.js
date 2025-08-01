import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInquiryEmail = async ({ name, email, message, propertyId }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.OWNER_EMAIL, // your email
    subject: 'New Property Inquiry Received',
    html: `
      <h2>New Inquiry from ${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <p><strong>Property ID:</strong> ${propertyId}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
