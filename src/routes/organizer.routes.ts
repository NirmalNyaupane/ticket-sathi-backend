import { Request, Router } from "express";
import OrganizerModel from "../models/organizer.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import validate from "../validators/validate.js";
import { registerOrganizer } from "../validators/organizers/registerOrganizer.js";
import upload from "../middlewares/multer.middleware.js";
import { registerOrganizerController } from "../controllers/organizer/organizer.controller.js";
import { verifyJwt, verifyPermission } from "../middlewares/auth.middleware.js";
import { Role } from "../types/enum.js";
const router = Router();

router.use(verifyJwt);
router.route("/register").post(
  verifyPermission([Role.ORGANIZER]),
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

export default router;
