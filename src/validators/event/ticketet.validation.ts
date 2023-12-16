import { body, param } from "express-validator";
import { DiscountType, Role } from "../../types/enum.js";

const ticketValidation = () => {
  return [
    body("event_id")
      .notEmpty()
      .withMessage("event_id is required")
      .isUUID()
      .withMessage("event_id must be an UUID"),

    body("name")
      .toUpperCase()
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 3, max: 10 })
      .withMessage("name must be minimum 3 and maximum 10 characters"),

    body("number_of_tickets")
      .notEmpty()
      .withMessage("number_of_tickets is required")
      .isInt()
      .withMessage("number_of_tickets must be integer"),

    body("max_per_person")
      .optional()
      .isInt()
      .withMessage("max_per_person must be integer"),

    body("tax")
      .notEmpty()
      .withMessage("tax is required")
      .isNumeric()
      .withMessage("tax must be number"),

    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isNumeric()
      .withMessage("price must be number"),

    body("early_bird_offer")
      .notEmpty()
      .withMessage("early_bird_offer is required")
      .isBoolean()
      .withMessage("early_bird_offer must be a boolean")
      .custom((value, { req }) => {
        if (
          value === false &&
          (req.body.discount_type ||
            req.body.discount ||
            req.body.discount_end_date)
        ) {
          throw new Error(
            "early_bird_offer need to be true for discount_type, discount, discount_end_date"
          );
        }

        return true;
      }),
    body("discount_type")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount_type is required")
      .isIn([DiscountType.FLAT, DiscountType.PERCENTAGE])
      .withMessage(
        `discount_type must be one of ${DiscountType.FLAT}, ${DiscountType.PERCENTAGE}`
      ),

    body("discount")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount is required")
      .isNumeric()
      .withMessage("discount must be number"),

    body("discount_end_date", "discount_end_date must be in future")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount_end_date is required")
      .isISO8601()
      .withMessage("discount_end_date must be must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),
  ];
};

export const updateTicketValidation = () => {
  return [
    body("event_id")
      .optional()
      .isUUID()
      .withMessage("event_id must be an UUID"),

    body("name")
      .optional()
      .toUpperCase()
      .isLength({ min: 3, max: 10 })
      .withMessage("name must be minimum 3 and maximum 10 characters"),

    body("number_of_tickets")
      .optional()
      .isInt()
      .withMessage("number_of_tickets must be integer"),

    body("max_per_person")
      .optional()
      .isInt()
      .withMessage("max_per_person must be integer"),

    body("tax").optional().isNumeric().withMessage("tax must be number"),

    body("price").optional().isNumeric().withMessage("price must be number"),

    body("early_bird_offer")
      .notEmpty()
      .withMessage("early_bird_offer is required")
      .isBoolean()
      .withMessage("early_bird_offer must be a boolean")
      .custom((value, { req }) => {
        if (
          value === false &&
          (req.body.discount_type ||
            req.body.discount ||
            req.body.discount_end_date)
        ) {
          throw new Error(
            "early_bird_offer need to be true for discount_type, discount, discount_end_date"
          );
        }

        return true;
      }),
    body("discount_type")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount_type is required")
      .isIn([DiscountType.FLAT, DiscountType.PERCENTAGE])
      .withMessage(
        `discount_type must be one of ${DiscountType.FLAT}, ${DiscountType.PERCENTAGE}`
      ),

    body("discount")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount is required")
      .isNumeric()
      .withMessage("discount must be number"),

    body("discount_end_date", "discount_end_date must be in future")
      .if((value, { req }) => req.body.early_bird_offer)
      .notEmpty()
      .withMessage("discount_end_date is required")
      .isISO8601()
      .withMessage("discount_end_date must be must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),
  ];
};

export const validateId = () => {
  return [
    param("id")
      .if((value, { req }) => req.params?.id)
      .isUUID()
      .withMessage("id must be uuid"),

    param("organizer_id")
      .if((value, { req }) => req.params?.organizer_id)
      .isUUID()
      .withMessage("organizer_id must be UUID"),
  ];
};

export default ticketValidation;
