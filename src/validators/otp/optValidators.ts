import { body } from "express-validator";

const optValidators = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email must be valid email"),

    body("otp")
      .trim()
      .notEmpty()
      .withMessage("opt is required")
      .isNumeric()
      .withMessage("otp must be number")
      .isLength({ max: 5, min: 5 })
      .withMessage("otp must be 5 digits"),
  ];
};

export default optValidators;
