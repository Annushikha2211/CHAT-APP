import nodemailer from "nodemailer";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
    connectionTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  } as nodemailer.TransportOptions);

  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  const mailOptions = {
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
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Gmail SMTP:", info.response);
    return info;
  } catch (error: any) {
    console.error("Gmail SMTP Error Details:", error);
    throw new Error("Failed to send OTP email");
  }
};