import { Request, Router } from "express";
import OrganizerModel from "../../models/organizer.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import validate from "../../validators/validate.js";
import {
  registerOrganizer,
  updateOrganizerValidation,
} from "../../validators/organizers/registerOrganizer.js";
import upload from "../../middlewares/multer.middleware.js";
import {
  registerOrganizerController,
  getOrganizerProfile,
  updateOrganizerController,
} from "../../controllers/organizer/organizer.controller.js";
import { verifyJwt, verifyPermission } from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import checkShopRegistered from "../../middlewares/organizer.middleware.js";
const router = Router();

router.use(verifyJwt);
router.use(verifyPermission([Role.ORGANIZER]));

router.route("/register").post(
  checkShopRegistered,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  registerOrganizer(),
  validate,
  registerOrganizerController
);

router.route("/").get(getOrganizerProfile);
router
  .route("/edit-profile")
  .patch(
    upload.single("logo"),
    updateOrganizerValidation(),
    validate,
    updateOrganizerController
  );

export default router;
