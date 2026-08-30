import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (
  email: string,
  otp: string,
  purpose: "signup" | "reset"
) => {
  const subject =
    purpose === "signup"
      ? "Chat App - Verify Your Email"
      : "Chat App - Reset Password";

  const { data, error } = await resend.emails.send({
    from: "ChatApp <onboarding@resend.dev>",
    to: [email],
    subject: subject,
    html: `
      <h2>Chat App</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });

  if (error) {
    console.error("Resend Email Error:", error);
    throw new Error("Failed to send OTP email");
  }

  return data;
};