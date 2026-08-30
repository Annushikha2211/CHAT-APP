const Brevo = require("@getbrevo/brevo");

export const sendOTPEmail = async (
  email: string,
  otp: string,
  type: string = "verification"
) => {
  const apiInstance = new Brevo.TransactionalEmailsApi();
  
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ""
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  const subject = type === "reset" ? "Password Reset OTP" : "Email Verification OTP";

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${subject}</h2>
      <p>Your OTP code is: <b style="font-size: 24px; color: #39FF88;">${otp}</b></p>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
  sendSmtpEmail.sender = {
    name: "ChatApp",
    email: process.env.EMAIL_USER || "annushikha1508@gmail.com",
  };
  sendSmtpEmail.to = [{ email: email }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
  } catch (error: any) {
    console.error("Brevo API Error:", error.response?.body || error);
    throw new Error("Failed to send OTP email");
  }
};