import { body, param } from "express-validator";
import { Event } from "../../types/enum.js";

const createEventValidation = () => {
  return [
    body("name")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 5, max: 30 })
      .withMessage(
        "name must be minimum 5 characters and maximum 30 characters"
      ),
    body("type")
      .notEmpty()
      .withMessage("type is required")
      .isIn([Event.CONCERT, Event.THEATER])
      .withMessage(`type must be one of ${Event.CONCERT}, ${Event.THEATER}`),
    body("description").notEmpty().withMessage("description is required"),
    body("event_start_date", "event_start_date must be future value")
      .notEmpty()
      .withMessage("event_start_date is required")
      .isISO8601()
      .withMessage("event_start_date must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),
    body("event_end_date", "event_end_date must be greater than event_end_date")
      .notEmpty()
      .withMessage("event_end_date is requried")
      .isISO8601()
      .withMessage("event_start_date must be ISO8601")
      .custom((value, { req }) => {
        return value > req.body.event_start_date;
      }),
    body("venue").notEmpty().withMessage("venue is required"),
    body("event_category_id")
      .notEmpty()
      .withMessage("event_category_id is requried")
      .isUUID()
      .withMessage("event_category_id must be an UUID"),
    body("address").notEmpty().withMessage("address is required"),
  ];
};

const eventIdValidation = () => {
  return [param("id").isUUID().withMessage("id must be uuid")];
};

const updateEventValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .toLowerCase()
      .isLength({ min: 5, max: 30 })
      .withMessage(
        "name must be minimum 5 characters and maximum 30 characters"
      ),
    body("type")
      .optional()
      .trim()
      .isIn([Event.CONCERT, Event.THEATER])
      .withMessage(`type must be one of ${Event.CONCERT}, ${Event.THEATER}`),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be string"),
    body("event_start_date", "event_start_date must be future value")
      .optional()
      .isISO8601()
      .withMessage("event_start_date must be ISO8601")
      .custom((value, { req }) => {
        return new Date(Date.now()).toISOString() < value;
      }),
    body("event_end_date", "event_end_date must be greater than event_end_date")
      .optional()
      .isISO8601()
      .withMessage("event_start_end must be ISO8601")
      .custom((value, { req }) => {
        return value > req.body.event_start_date;
      }),
    body("venue").optional().isString().withMessage("venue is required"),
    body("event_category_id")
      .optional()
      .isUUID()
      .withMessage("event_category_id must be an UUID"),
    body("address").optional().isString().withMessage("address must be string"),
    param("id").isUUID().withMessage("id must be uuid"),
  ];
};

export { createEventValidation, eventIdValidation, updateEventValidation };
