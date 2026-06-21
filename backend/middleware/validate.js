import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: "Validation error",
    errors: result.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

export default validate;
