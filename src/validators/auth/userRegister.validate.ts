import { body, param } from "express-validator";
import { Role } from "../../types/user.enum.js";

const userRegisterValidators = () => {
  return [
    body("full_name")
      .trim()
      .notEmpty()
      .withMessage("full_name is required")
      .matches(/^(?=.{1,50}$)[a-zA-Z-]+(?: [a-zA-Z]+(?: [a-zA-Z-]+)?)?$/)
      .withMessage("full_name only allowed space and alphabet"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email must be an email"),

    body("phone_number")
      .trim()
      .notEmpty()
      .withMessage("phone_number is required")
      .matches(/[0-9]/)
      .withMessage("Invalid phone_number")
      .isLength({ max: 10, min: 10 })
      .withMessage("Invalid phone_number"),

    body("address").trim().optional(),
    body("role")
      .trim()
      .isIn([Role.SELLER, Role.USER])
      .withMessage(
        `role must be one of the following values: ${Role.SELLER}, ${Role.USER}`
      ),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)
      .withMessage("password is not strong"),
  ];
};

const userLoginValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email must be a valid email"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)
      .withMessage("password is not strong"),
  ];
};

const initiatePasswordResetValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email must be valid email"),
  ];
};

const finalizePasswordResetValidation = () => {
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
      .withMessage("otp is required")
      .isLength({ max: 5, min: 5 })
      .withMessage("otp has 5 digits"),
    body("new_password")
      .trim()
      .notEmpty()
      .withMessage("new_password is required")
      .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)
      .withMessage("password is not strong"),
  ];
};

export {
  userRegisterValidators,
  userLoginValidation,
  initiatePasswordResetValidation,
  finalizePasswordResetValidation,
};
