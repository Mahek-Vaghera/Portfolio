import mongoose from "mongoose";
import Counter from "./Counter.js";

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Anonymous",
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: undefined,
    },
    feedback: {
      type: String,
      required: [true, "Feedback is required"],
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

feedbackSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: "feedback_id" },
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

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
