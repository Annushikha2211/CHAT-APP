import axios from "axios";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("BREVO_API_KEY is missing in Environment Variables!");
    throw new Error("Failed to send OTP email: Missing API Key");
  }

  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "ChatApp", email: "annushikha1508@gmail.com" },
        to: [{ email: email }],
        subject: subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
      }
    );

    console.log("OTP Email sent successfully via Brevo REST API:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Brevo API Error:", error.response?.data || error.message);
    throw new Error("Failed to send OTP email");
  }
};