import { body, check } from "express-validator";
import { Role } from "../../types/enum.js";
const userUpdateValidation = () => {
  console.log(body("full_name").isAfter());
  return [
    body("full_name")
      .optional()
      .notEmpty()
      .matches(/^(?=.{1,50}$)[a-zA-Z-]+(?: [a-zA-Z]+(?: [a-zA-Z-]+)?)?$/)
      .withMessage("full_name only allowed space and alphabet"),

    body("phone_number")
      .trim()
      .optional()
      .matches(/[0-9]/)
      .withMessage("Invalid phone_number")
      .isLength({ max: 10, min: 10 })
      .withMessage("Invalid phone_number"),

    body("address").optional(),
    body("role")
      .optional()
      .trim()
      .isIn([Role.ORGANIZER, Role.USER, Role.ADMIN])
      .withMessage(
        `role must be one of the following values: ${Role.ORGANIZER}, ${Role.USER}, ${Role.ADMIN}`
      ),

    body("old_password")
      .optional()
      .trim()
      .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/)
      .withMessage("password is not strong"),

    check("new_password")
      .if((value, { req }) => req.body.oldPassword)
      .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/),
  ];
};
export default userUpdateValidation;
