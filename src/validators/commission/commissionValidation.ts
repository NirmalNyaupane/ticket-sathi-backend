import { body } from "express-validator";
import { CommissionStatus } from "../../types/enum.js";
const createCommissionValidators = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ max: 20, min: 5 })
      .withMessage(
        "name must be minimum 5 characters and maximum 20 characters"
      ),

    body("percentage")
      .notEmpty()
      .withMessage("percentage is required")
      .isNumeric()
      .withMessage("percentage must be number"),

    body("organizer_ids")
      .notEmpty()
      .withMessage("organizer_ids is required")
      .isArray()
      .withMessage("organizer_ids must be an array"),

    body("organizer_ids.*")
      .isUUID()
      .withMessage("organizer_ids must be an UUID"),

    body("status")
      .notEmpty()
      .withMessage("status is required")
      .isIn([CommissionStatus.ACTIVE, CommissionStatus.INACTIVE])
      .withMessage(
        `status must be one of ${CommissionStatus.ACTIVE}, ${CommissionStatus.INACTIVE}`
      ),
  ];
};

export { createCommissionValidators };
