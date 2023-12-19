import { body, check, param } from "express-validator";
import { OrganizerStatus } from "../../types/enum.js";

const registerOrganizer = () => {
  return [
    body("organizer_name")
      .notEmpty()
      .withMessage("organizer_name is required")
      .isLength({ max: 450 })
      .withMessage("Description less then 450 characters"),
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

const updateOrganizerValidation = () => {
  return [
    body("organizer_name").optional(),
    body("description")
      .optional()
      .isLength({ max: 450 })
      .withMessage("Description less then 450 characters"),
    body("website").optional().isURL().withMessage("website must be valid url"),
    body("address", "address must be string  ").optional().isString(),
    body("social_links")
      .optional()
      .isArray()
      .withMessage("invalid social links"),
    check("social_links.*.name", "social_links.name must be string").isString(),
    check("social_links.*.url", "social_links.url must be url").isURL(),
  ];
};

const changeOrganizerStatus = () => {
  return [
    body("status")
      .notEmpty()
      .withMessage("status is required")
      .isIn([
        OrganizerStatus.ACTIVE,
        OrganizerStatus.PENDING,
        OrganizerStatus.SUSPEND,
      ])
      .withMessage(
        `status must be one of ${OrganizerStatus.ACTIVE}, ${OrganizerStatus.PENDING}, ${OrganizerStatus.SUSPEND}`
      ),
  ];
};

export { registerOrganizer, updateOrganizerValidation, changeOrganizerStatus };
