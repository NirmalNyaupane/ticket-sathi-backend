import { body, param } from "express-validator";

const eventCategoryValidation = () => {
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
    body("description").optional(),
    param("id")
      .notEmpty()
      .isString()
      .withMessage("id must be UUID"),
  ];
};

const deleteCategoryValidation = () => {
  return [param("id").isUUID().withMessage("id must be UUID")];
};
export {
  eventCategoryValidation,
  eventCategoryUpdateValidaton,
  deleteCategoryValidation,
};
