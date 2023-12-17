import { Router } from "express";
import {
  createEvent as createEventController,
  deleteEvent,
  getEvent,
  updateEvent,
} from "../../controllers/event/event.controller.js";
import {
  createEventCategory,
  getAllCategory,
  updateCategory,
} from "../../controllers/event/eventCategory.controller.js";
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import {
  createEventValidation,
  eventIdValidation,
  updateEventValidation,
} from "../../validators/event/event.js";
import {
  eventCategoryUpdateValidaton,
  eventCategoryValidation,
} from "../../validators/event/eventCategory.js";

import { eventSpeakerValidation } from "../../validators/event/eventSpeaker.validation.js";
import upload from "../../middlewares/multer.middleware.js";
import validate from "../../validators/validate.js";
import { eventSpeaker } from "../../controllers/event/eventSpeaker.controller.js";
const router = Router();

router.use(verifyJwt);
router.use(verifyPermission([Role.ORGANIZER]));

/* ************************* Event router starts ************************************* */
router
  .route("/")
  .post(
    upload.fields([
      {
        name: "poster_image",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 2,
      },
    ]),
    createEventValidation(),
    validate,
    createEventController
  )
  .get(getEvent);

router
  .route("/:id")
  .delete(eventIdValidation(), validate, deleteEvent)
  .patch(
    upload.single("poster_image"),
    updateEventValidation(),
    validate,
    updateEvent
  );

/************************** Event speaker route ********************/
router
  .route("/speaker")
  .post(
    upload.single("avatar"),
    eventSpeakerValidation(),
    validate,
    eventSpeaker
  );

/* ******************* Event Category ************************************************ */
router
  .route("/category")
  .get(getAllCategory)
  .post(eventCategoryValidation(), validate, createEventCategory);

router
  .route("/category/:id")
  .patch(eventCategoryUpdateValidaton(), validate, updateCategory)
  .delete(eventCategoryValidation(), validate);
export default router;
