import { body, check } from "express-validator";
import { DiscountType } from "../../types/enum.js";

const createCoupon = () => {
  return [
    body("event_id")
      .trim()
      .notEmpty()
      .withMessage("event_id is required")
      .isUUID()
      .withMessage("event_id must be an UUID"),

    body("tickets_ids")
      .notEmpty()
      .withMessage("tickets_ids must be required")
      .isArray()
      .withMessage("tickets_ids must be an array"),

    check("tickets_ids.*")
      .trim()
      .isUUID()
      .withMessage("all tickets_ids must be an UUID"),

    body("name").trim().notEmpty().withMessage("name is required"),

    body("code")
      .trim()
      .toUpperCase()
      .notEmpty()
      .withMessage("code is required"),

    body("discount_type")
      .trim()
      .notEmpty()
      .withMessage("discount_type is required")
      .isIn([DiscountType.FLAT, DiscountType.PERCENTAGE])
      .withMessage(
        `discount_type must be one of ${DiscountType.FLAT}, ${DiscountType.PERCENTAGE}`
      ),

    body("discount")
      .trim()
      .notEmpty()
      .withMessage("discount is required")
      .isNumeric()
      .withMessage(
        "discount must be an number representing amount or percentage"
      ),

    body("discount_end_date", "discount_end_date must be in future")
      .notEmpty()
      .withMessage("discount_end_date is required")
      .isISO8601()
      .withMessage("discount_end_date must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),

    body("number_of_coupons")
      .notEmpty()
      .withMessage("number_of_coupons is required")
      .isInt()
      .withMessage("number_of_coupons must be an integer"),

    body("is_active")
      .notEmpty()
      .withMessage("is_active is required")
      .isBoolean()
      .withMessage("is_active must be an boolean"),

    body("min_amount")
      .optional()
      .isNumeric()
      .withMessage("min_amount must be a number"),
  ];
};

const updateCoupon = () => {
  return [
    body("event_id")
      .trim()
      .optional()
      .isUUID()
      .withMessage("event_id must be an UUID"),

    body("tickets_ids")
      .optional()
      .isArray()
      .withMessage("tickets_ids must be an array"),

    check("tickets_ids.*")
      .trim()
      .optional()
      .isUUID()
      .withMessage("all tickets_ids must be an UUID"),

    body("name").optional().trim().isString().withMessage("name must be an uuid"),

    body("code")
      .trim()
      .toUpperCase()
      .optional(),

    body("discount_type")
      .trim()
      .optional()
      .isIn([DiscountType.FLAT, DiscountType.PERCENTAGE])
      .withMessage(
        `discount_type must be one of ${DiscountType.FLAT}, ${DiscountType.PERCENTAGE}`
      ),

    body("discount")
      .trim()
      .optional()
      .isNumeric()
      .withMessage(
        "discount must be an number representing amount or percentage"
      ),

    body("discount_end_date", "discount_end_date must be in future")
      .optional()
      .isISO8601()
      .withMessage("discount_end_date must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),

    body("number_of_coupons")
      .optional()
      .isInt()
      .withMessage("number_of_coupons must be an integer"),

    body("is_active")
      .optional()
      .isBoolean()
      .withMessage("is_active must be an boolean"),

    body("min_amount")
      .optional()
      .isNumeric()
      .withMessage("min_amount must be a number"),
  ];
};
export { createCoupon, updateCoupon };
