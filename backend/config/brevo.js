const getBrevoConfig = () => ({
  apiKey: process.env.BREVO_API_KEY || "",
  senderName: process.env.SENDER_NAME || "Mahek-Portfolio",
  senderEmail: process.env.SENDER_EMAIL || "mahekvaghera.portfolio@gmail.com",
  myEmail: process.env.MY_EMAIL || "",
});

export default getBrevoConfig;
