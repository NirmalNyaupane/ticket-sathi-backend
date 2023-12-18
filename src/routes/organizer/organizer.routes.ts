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
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import checkShopRegistered from "../../middlewares/organizer.middleware.js";
import { getAllOrganizerByAdmin } from "../../controllers/organizer/organizer.controller.js";
const router = Router();

router.use(verifyJwt);

router.route("/register").post(
  verifyPermission([Role.ORGANIZER]),
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

router.route("/").get(verifyPermission([Role.ORGANIZER]), getOrganizerProfile);
router
  .route("/edit-profile")
  .patch(
    verifyPermission([Role.ORGANIZER]),
    upload.single("logo"),
    updateOrganizerValidation(),
    validate,
    updateOrganizerController
  );

//organizer admin route
router
  .route("/all/admin")
  .get(verifyPermission([Role.ADMIN]), getAllOrganizerByAdmin);

export default router;
