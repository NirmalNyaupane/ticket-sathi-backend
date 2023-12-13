import { body } from "express-validator";
import { Event } from "../../types/enum.js";

const createEventValidation = () => {
  return [
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

export { createEventValidation };
