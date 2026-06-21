import Feedback from "../models/Feedback.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";

const maskEmail = (email) => {
  const value = String(email ?? "").trim();
  const [localPart, domain] = value.split("@");

  if (!localPart || !domain) {
    return value;
  }

  const visibleStart = localPart.slice(0, 1);
  const visibleEnd = localPart.length > 2 ? localPart.slice(-1) : "";
  const maskedLength = Math.max(1, localPart.length - visibleStart.length - visibleEnd.length);

  return `${visibleStart}${"*".repeat(maskedLength)}${visibleEnd}@${domain}`;
};

const getFeedbackThankYouHtml = (name) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Your Feedback</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f6f9fc;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px;
            font-size: 16px;
            line-height: 1.6;
            color: #334155;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 16px;
          }
          .message {
            margin-bottom: 24px;
          }
          .signature {
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            color: #64748b;
          }
          .signature-name {
            font-weight: 600;
            color: #0f172a;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Feedback!</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${name},</div>
            <div class="message">
              We have received your feedback and appreciate you taking the time to share it. Your comments and suggestions are extremely valuable to us.
            </div>
            <div class="signature">
              Regards,<br>
              <span class="signature-name">Mahek-Portfolio</span>
            </div>
          </div>
          <div class="footer">
            This email was sent automatically from Mahek-Portfolio.
          </div>
        </div>
      </body>
    </html>
  `;
};

const getAdminCredentials = (req) => {
  const email =
    req.body?.email || req.query?.email || req.headers["x-admin-email"];
  const password =
    req.body?.password || req.query?.password || req.headers["x-admin-password"];

  return {
    email: String(email ?? "").trim(),
    password: String(password ?? "").trim(),
  };
};

const createFeedback = async (req, res, next) => {
  try {
    const { name, email, rating, feedback } = req.body;

    const thankYouBody = [
      "Thank you for your feedback!",
      "",
      `Hi ${name.trim()},`,
      "",
      "We have received your feedback and appreciate you taking the time to share it.",
      "",
      "Regards,",
      "Mahek-Portfolio",
    ].join("\n");

    try {
      await sendEmail({
        to: email.trim().toLowerCase(),
        subject: "Thank you for your feedback",
        textContent: thankYouBody,
        htmlContent: getFeedbackThankYouHtml(name.trim()),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "May be your email is not correct.",
      });
    }

    const savedFeedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rating:
        rating === undefined || rating === null || rating === ""
          ? undefined
          : Number(rating),
      feedback: feedback.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    const seen = new Set();
    const uniqueFeedback = feedback.filter((item) => {
      const key = [item.name, item.email, item.feedback].join("\u0001");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return res.status(200).json({
      success: true,
      feedback: uniqueFeedback.map((item) => ({
        ...item.toObject(),
        email: maskEmail(item.email),
      })),
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedbackIdRaw = String(req.body?.id ?? req.body?.feedbackId ?? "").trim();
    const { password } = getAdminCredentials(req);

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    if (!feedbackIdRaw) {
      return res.status(400).json({
        success: false,
        message: "Feedback id is required.",
      });
    }

    let deletedFeedback = null;

    // First try: match the custom sequential integer ID if input is digits
    if (/^\d+$/.test(feedbackIdRaw)) {
      deletedFeedback = await Feedback.findOneAndDelete({ id: Number(feedbackIdRaw) });
    }

    // Second try (fallback): match standard MongoDB _id if valid
    if (!deletedFeedback && mongoose.isValidObjectId(feedbackIdRaw)) {
      deletedFeedback = await Feedback.findByIdAndDelete(feedbackIdRaw);
    }

    if (!deletedFeedback) {
      return res.status(400).json({
        success: false,
        message: "No feedback found with the provided id.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export { createFeedback, deleteFeedback, getFeedback };
