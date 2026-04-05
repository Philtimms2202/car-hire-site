'use server'

import nodemailer from 'nodemailer'

export async function sendEmail(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const subject = formData.get('subject')
  const message = formData.get('message')

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: "info@timmstravel.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `"Timms Travel Contact Form" <info@timmstravel.com>`,
    to: "info@timmstravel.com",
    subject: `New Contact Form Message: ${subject}`,
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
  })

  return { success: true }
}