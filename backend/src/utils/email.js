import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, code) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Gmail SMTP credentials are not configured.');
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Verify your Find My Laundry account',
    text: `Your Find My Laundry verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Find My Laundry</h2>
        <p>Use this verification code to verify your email address:</p>
        <h1 style="letter-spacing: 8px;">${code}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}