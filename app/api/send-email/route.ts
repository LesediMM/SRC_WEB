import nodemailer from "nodemailer"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    // Send email to both recipients
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "Lesedi@aucegypt.edu,src.source.labs@gmail.com",
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: emailContent,
    })

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your message - S.R.C. Labs",
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p>Best regards,<br>S.R.C. Labs Team</p>
      `,
    })

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
