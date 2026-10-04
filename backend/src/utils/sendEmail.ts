import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  try {
    const data = await resend.emails.send({
      from: "ChatApp <onboarding@resend.dev>", // Resend ka free email ID
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

    console.log("OTP Email sent successfully via Resend:", data);
    return data;
  } catch (error: any) {
    console.error("Resend Error:", error);
    throw new Error("Failed to send OTP email");
  }
};

// import nodemailer from "nodemailer";

// export const sendOTPEmail = async (
//   email: string,
//   otp: string,
//   type: string = "verification"
// ) => {
//   const transporter = nodemailer.createTransport({
//     // Direct IPv4 address of Gmail SMTP to completely bypass Render's IPv6 issue
//     host: "142.250.153.108", 
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       servername: "smtp.gmail.com", // Necessary for SSL certificate matching
//       rejectUnauthorized: false,
//     },
//   } as nodemailer.TransportOptions);

//   const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

//   const mailOptions = {
//     from: `"ChatApp" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: subject,
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>${subject}</h2>
//         <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
//         <p>This code will expire in 10 minutes.</p>
//       </div>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent via Direct IPv4 SMTP:", info.response);
//     return info;
//   } catch (error: any) {
//     console.error("Gmail SMTP Error Details:", error);
//     throw new Error("Failed to send OTP email");
//   }
// };