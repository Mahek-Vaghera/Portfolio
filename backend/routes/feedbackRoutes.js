import { Router } from "express";
import { body } from "express-validator";
import {
  createFeedback,
  deleteFeedback,
  getFeedback,
} from "../controllers/feedbackController.js";
import validate from "../middleware/validate.js";

const router = Router();

const feedbackValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .isLength({ max: 255 }),
  body("feedback")
    .trim()
    .notEmpty()
    .withMessage("Feedback is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Feedback must be between 10 and 5000 characters"),
  body("rating")
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .toInt(),
];

router.post("/", feedbackValidation, validate, createFeedback);
router.get("/", getFeedback);
router.delete(
  "/",
  [
    body("id")
      .customSanitizer((value) => String(value ?? "").trim())
      .notEmpty()
      .withMessage("Feedback id is required"),
    body("password")
      .customSanitizer((value) => String(value ?? "").trim())
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validate,
  deleteFeedback,
);

export default router;
