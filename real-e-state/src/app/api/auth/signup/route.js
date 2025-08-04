import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email === process.env.MAIL_USER;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Notify Admin via Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `E-State <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "New User Registration",
      text: `New user registered: ${newUser.email}`,
    });

    // Optional: Notify via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "e-state@yourdomain.com",
      to: process.env.MAIL_USER,
      subject: "New User Registered",
      html: `<p>A new user has registered: <strong>${newUser.name}</strong> (${newUser.email})</p>`,
    });

    const response = NextResponse.json({ message: "Registration successful." }, { status: 201 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
