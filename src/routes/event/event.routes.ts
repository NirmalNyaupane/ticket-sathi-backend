import { Router } from "express";
import {
  createEvent as createEventController,
  deleteEvent,
  getAllEventByAdmin,
  getEvent,
  updateEvent,
} from "../../controllers/event/event.controller.js";
import {
  createEventCategory,
  deleteCategory,
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

import {
  deleteEventSpeaker,
  eventSpeaker,
  getEventSpeaker,
  updateEventSpeaker,
} from "../../controllers/event/eventSpeaker.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import {
  eventSpeakerValidation,
  updateEventSpeakerValidation,
} from "../../validators/event/eventSpeaker.validation.js";
import validate from "../../validators/validate.js";
const router = Router();

/* ************************* Event router starts ************************************* */
router
  .route("/")
  .post(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
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
  .get(verifyJwt, verifyPermission([Role.ORGANIZER]), getEvent);

router
  .route("/:id")
  .delete(
    verifyJwt,
    verifyPermission([Role.ORGANIZER, Role.ADMIN]),
    eventIdValidation(),
    validate,
    deleteEvent
  )
  .patch(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    upload.single("poster_image"),
    updateEventValidation(),
    validate,
    updateEvent
  );

/************************** Event speaker route ********************/
router
  .route("/speaker")
  .post(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    upload.single("avatar"),
    eventSpeakerValidation(),
    validate,
    eventSpeaker
  );

//get all event speakers by an event_id and update, delete by speaker id
router
  .route("/speaker/:id")
  .get(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    eventIdValidation(),
    validate,
    getEventSpeaker
  )
  .patch(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    upload.single("avatar"),
    eventIdValidation(),
    validate,
    updateEventSpeakerValidation(),
    validate,
    updateEventSpeaker
  )
  .delete(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    eventIdValidation(),
    validate,
    deleteEventSpeaker
  );

/* ******************* Event Category ************************************************ */
router
  .route("/category")
  .get(verifyJwt, verifyPermission([Role.ORGANIZER]), getAllCategory)
  .post(eventCategoryValidation(), validate, createEventCategory);

router
  .route("/category/:id")
  .patch(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    eventCategoryUpdateValidaton(),
    validate,
    updateCategory
  )
  .delete(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    eventCategoryValidation(),
    validate,
    deleteCategory
  );


/******************event admin route**********************/
router.route("/all/admin").get(verifyJwt, verifyPermission([Role.ADMIN]), getAllEventByAdmin)


/**Event open route */
router.route("/all").get(getAllEventByAdmin);
export default router;

