import getBrevoConfig from "../config/brevo.js";

const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

const isPlaceholderEmail = (email) =>
  !email || /example\.com$/i.test(email) || /verified_sender/i.test(email);

const sendEmail = async ({ to, subject, textContent, htmlContent }) => {
  const brevoConfig = getBrevoConfig();
  const senderEmail = isPlaceholderEmail(brevoConfig.senderEmail)
    ? brevoConfig.myEmail
    : brevoConfig.senderEmail;

  if (!brevoConfig.apiKey || !senderEmail || !to) {
    const error = new Error("Email service is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(BREVO_EMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": brevoConfig.apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brevoConfig.senderName,
        email: senderEmail,
      },
      to: [{ email: to }],
      subject,
      textContent,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${details}`);
  }

  return response.json();
};

export default sendEmail;
