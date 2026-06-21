import Contact from "../models/Contact.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";

const getContactHtmlEmail = (contact) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Request</title>
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
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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
          .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px 40px;
          }
          .field-group {
            margin-bottom: 20px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 15px;
          }
          .field-group:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
          }
          .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .value {
            font-size: 15px;
            color: #1e293b;
            line-height: 1.5;
          }
          .message-box {
            background-color: #f8fafc;
            border-left: 4px solid #6366f1;
            padding: 15px 20px;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: #334155;
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
            <h1>New Contact Request</h1>
            <p>Portfolio Contact Form Submission (ID: ${contact.id})</p>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Name</div>
              <div class="value" style="font-weight: 600; color: #0f172a;">${contact.name}</div>
            </div>
            <div class="field-group">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${contact.email}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">${contact.email}</a></div>
            </div>
            <div class="field-group">
              <div class="label">Subject</div>
              <div class="value">${contact.subject}</div>
            </div>
            <div class="field-group">
              <div class="label">Message</div>
              <div class="value message-box">${contact.message.replace(/\n/g, "<br />")}</div>
            </div>
          </div>
          <div class="footer">
            This email was sent automatically from your portfolio website.
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

const isAdminAuthenticated = (req) => {
  const { email, password } = getAdminCredentials(req);

  return (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  );
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const savedContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    const textBody = [
      `New Portfolio Contact (ID: ${savedContact.id})`,
      "",
      "Name:",
      `${savedContact.name}`,
      "",
      "Email:",
      `${savedContact.email}`,
      "",
      "Subject:",
      `${savedContact.subject}`,
      "",
      "Message:",
      `${savedContact.message}`,
    ].join("\n");

    try {
      await sendEmail({
        to: process.env.MY_EMAIL,
        subject: `New Contact Form Submission (ID: ${savedContact.id})`,
        textContent: textBody,
        htmlContent: getContactHtmlEmail(savedContact),
      });
    } catch (emailError) {
      return res.status(502).json({
        success: false,
        message: "Contact saved, but email could not be sent.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      const configError = new Error("Admin credentials are not configured");
      configError.statusCode = 500;
      throw configError;
    }

    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    const seen = new Set();
    const uniqueContacts = contacts.filter((contact) => {
      const key = [contact.name, contact.email, contact.message].join("\u0001");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return res.status(200).json({
      success: true,
      contacts: uniqueContacts,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contactIdRaw = String(req.body?.id ?? req.body?.contactId ?? "").trim();
    const { password } = getAdminCredentials(req);

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    if (!contactIdRaw) {
      return res.status(400).json({
        success: false,
        message: "Contact id is required.",
      });
    }

    let deletedContact = null;

    // First try: match the custom sequential integer ID if input is digits
    if (/^\d+$/.test(contactIdRaw)) {
      deletedContact = await Contact.findOneAndDelete({ id: Number(contactIdRaw) });
    }

    // Second try (fallback): match standard MongoDB _id if valid
    if (!deletedContact && mongoose.isValidObjectId(contactIdRaw)) {
      deletedContact = await Contact.findByIdAndDelete(contactIdRaw);
    }

    if (!deletedContact) {
      return res.status(400).json({
        success: false,
        message: "No contact found with the provided id.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export { createContact, deleteContact, getContacts };
