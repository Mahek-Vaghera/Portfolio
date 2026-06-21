import mongoose from "mongoose";
import Counter from "./Counter.js";

const contactSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 255,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be valid"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
    id: false,
  },
);

contactSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: "contact_id" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
