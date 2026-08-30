export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY || "",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "ChatApp",
          email: process.env.EMAIL_USER || "annushikha1508@gmail.com",
        },
        to: [{ email: email }],
        subject: subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo Direct API Error:", errorData);
      throw new Error("Failed to send OTP email");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Brevo Fetch Error:", error.message);
    throw new Error("Failed to send OTP email");
  }
};