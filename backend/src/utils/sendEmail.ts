import nodemailer from "nodemailer";

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ChatApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - ChatApp",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verification Code</h2>
        <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });
};