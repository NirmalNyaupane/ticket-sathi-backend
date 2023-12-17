import { body, check } from "express-validator";

const eventSpeakerValidation = () => {
  return [
    body("event_id")
      .notEmpty()
      .withMessage("event_id is required")
      .isUUID()
      .withMessage("event_id must be an uuid"),
    body("name").notEmpty().withMessage("name is required"),
    body("title").notEmpty().withMessage("title is required"),
    body("social_links")
      .optional()
      .isArray()
      .withMessage("invalid social links"),
    check("social_links.*.name", "social_links.name must be string").isString(),
    check("social_links.*.url", "social_links.url must be url").isURL(),
  ];
};


const updateEventSpeakerValidation = () => {
  return [
    body("event_id")
      .optional()
      .isUUID()
      .withMessage("event_id must be an uuid"),
    body("name").optional().isString().withMessage("name must be string"),
    body("title").optional().isString().withMessage("title must be string"),
    body("social_links")
      .optional()
      .isArray()
      .withMessage("invalid social links"),
    check("social_links.*.name", "social_links.name must be string").isString(),
    check("social_links.*.url", "social_links.url must be url").isURL(),
  ];
};

export { eventSpeakerValidation, updateEventSpeakerValidation};
