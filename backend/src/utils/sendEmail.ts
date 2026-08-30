import nodemailer from "nodemailer";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as any);

  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  await transporter.sendMail({
    from: `"ChatApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  });
};