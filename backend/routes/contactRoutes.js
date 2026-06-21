import { Router } from "express";
import { body } from "express-validator";
import {
  createContact,
  deleteContact,
  getContacts,
} from "../controllers/contactController.js";
import validate from "../middleware/validate.js";

const router = Router();

const contactValidation = [
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
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Subject must be between 3 and 150 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

router.post("/", contactValidation, validate, createContact);
router.get("/", getContacts);
router.delete(
  "/",
  [
    body("id")
      .customSanitizer((value) => String(value ?? "").trim())
      .notEmpty()
      .withMessage("Contact id is required"),
    body("password")
      .customSanitizer((value) => String(value ?? "").trim())
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validate,
  deleteContact,
);

export default router;
