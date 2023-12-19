import { query, param } from "express-validator";

const validateId = () => {
  return [param("id").isUUID().withMessage("UUID must be an UUID")];
};

const paginatedRequestValidators = () => {
  return [
    query("page").optional().isInt().withMessage("page must be an Integer"),
    query("limit").optional().isInt().withMessage("limit must be an Integer"),
  ];
};

const paginateAndSearchRequestValidators = () => {
  return [
    query("page").optional().isInt().withMessage("page must be an Integer"),
    query("limit").optional().isInt().withMessage("limit must be an Integer"),
    query("name").optional().isString().withMessage("name must be an string"),
  ];
};

export {
  paginatedRequestValidators,
  paginateAndSearchRequestValidators,
  validateId,
};
