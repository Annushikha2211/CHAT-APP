import { Resend } from "resend";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  // Key ab tabhi mangi jayegi jab koi Signup button dabayega, pehle se server crash nahi hoga
  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  try {
    const data = await resend.emails.send({
      from: "ChatApp <onboarding@resend.dev>",
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

    console.log("OTP Email sent via Resend:", data);
    return data;
  } catch (error: any) {
    console.error("Resend Error:", error);
    throw new Error("Failed to send OTP email");
  }
};