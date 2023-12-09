import { body, check, param } from "express-validator";

const registerOrganizer = () => {
  return [
    body("organizer_name").notEmpty().withMessage("organizer_name is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("website").optional().isURL().withMessage("website must be valid url"),
    body("address").notEmpty().withMessage("address is required"),
    body("social_links")
      .notEmpty()
      .withMessage("social_links are required")
      .isArray()
      .withMessage("invalid social links"),
    check("social_links.*.name", "social_links.name must be string").isString(),
    check("social_links.*.url", "social_links.url must be url").isURL(),
  ];
};

export {registerOrganizer};