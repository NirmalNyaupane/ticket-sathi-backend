import { Router } from "express";
import {
  eventCategoryUpdateValidaton,
  eventCategoryValidation,
  deleteCategoryValidation,
} from "../../validators/event/eventCategory.js";
import validate from "../../validators/validate.js";
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import { createEvent as createEventController } from "../../controllers/event/event.controller.js";
import {
  createEventCategory,
  getAllCategory,
  updateCategory,
} from "../../controllers/event/eventCategory.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { createEventValidation } from "../../validators/event/event.js";
import multer from "multer";
import { storage } from "../../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJwt);
router.use(verifyPermission([Role.ORGANIZER]));

/* ************************* Event router starts ************************************* */
router.route("/").post(
  multer({ storage: storage }).fields([
    { name: "poster_image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createEventValidation(),
  validate,
  createEventController
);

/* ******************* Event Category ************************************************ */
router
  .route("/category")
  .get(getAllCategory)
  .post(eventCategoryValidation(), validate, createEventCategory);

router
  .route("/category/:id")
  .patch(eventCategoryUpdateValidaton(), validate, updateCategory)
  .delete(deleteCategoryValidation(), validate);
export default router;
