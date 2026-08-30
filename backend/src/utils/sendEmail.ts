import dns from "dns";
import "dotenv/config";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL PASS EXISTS:",
  !!process.env.EMAIL_PASS
);

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
} as any);

export const sendOTPEmail = async (
  email: string,
  otp: string,
  purpose: "signup" | "reset"
) => {
  const subject =
    purpose === "signup"
      ? "Chat App - Verify Your Email"
      : "Chat App - Reset Password";

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,

    html: `
      <h2>Chat App</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>

      <p>If you did not request this, ignore this email.</p>
    `,
  });
};