import { body, param } from "express-validator";

const eventCategoryValidation = () => {
  console.log("hello there");
  return [
    body("category_name")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("category_name is required"),
    body("description").notEmpty().withMessage("description is required"),
  ];
};

const eventCategoryUpdateValidaton = () => {
  return [
    body("category_name").optional().trim().toLowerCase(),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be string"),
    param("id").notEmpty().isUUID().withMessage("id must be UUID"),
  ];
};

const categoryIdValidation = () => {
  return [param("id").isUUID().withMessage("id must be UUID")];
};
export {
  eventCategoryValidation,
  eventCategoryUpdateValidaton,
  categoryIdValidation,
};
