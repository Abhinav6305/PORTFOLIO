import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db, serverTimestamp } from "@/lib/firebaseAdmin"

const mailTo = process.env.MAIL_TO ?? "abhinavrishisaka@gmail.com"
const mailFrom = process.env.MAIL_FROM ?? "no-reply@visionix.com"
const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT ?? "587")
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS

const transporter = nodemailer.createTransport({
  host: smtpHost || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  auth:
    smtpHost && smtpUser && smtpPass
      ? {
          user: smtpUser,
          pass: smtpPass,
        }
      : undefined,
})

async function sendEmail(name: string, email: string, message: string) {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return false
  }

  await transporter.sendMail({
    from: `${name} <${mailFrom}>`,
    to: mailTo,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  })

  return true
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    const docRef = await db.collection("contacts").add({
      name,
      email,
      message,
      createdAt: serverTimestamp(),
    })

    const emailSent = await sendEmail(name, email, message)

    return NextResponse.json({
      success: true,
      id: docRef.id,
      emailSent,
      notice: emailSent
        ? "Message saved and email sent."
        : "Message saved. Email service is not configured.",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { error: "Unable to send your message right now." },
      { status: 500 }
    )
  }
}
