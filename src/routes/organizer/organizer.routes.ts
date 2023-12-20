import { Router } from "express";
import {
  paginateAndSearchRequestValidators,
  validateId,
} from "../../validators/common.validation.js";
import {
  getAllOrganizerByAdmin,
  getOrganizerProfile,
  registerOrganizerController,
  updateOrganizerController,
  changeOrganizerStatus as changeOrganizerController,
} from "../../controllers/organizer/organizer.controller.js";
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";
import checkShopRegistered from "../../middlewares/organizer.middleware.js";
import { Role } from "../../types/enum.js";
import {
  registerOrganizer,
  updateOrganizerValidation,
  changeOrganizerStatus,
  filterOrganizerStatus,
} from "../../validators/organizers/registerOrganizer.js";
import validate from "../../validators/validate.js";
const router = Router();

router.route("/register").post(
 verifyJwt,
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

router
  .route("/")
  .get(
   verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    getOrganizerProfile
  );
router
  .route("/edit-profile")
  .patch(
   verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    upload.single("logo"),
    updateOrganizerValidation(),
    validate,
    updateOrganizerController
  );

/*************************** organizer admin route ************************/
router
  .route("/all/admin")
  .get(
   verifyJwt,
    verifyPermission([Role.ADMIN]),
    paginateAndSearchRequestValidators(),
    validate,
    filterOrganizerStatus(),
    validate,
    getAllOrganizerByAdmin
  );

router
  .route("/change-status/:id")
  .post(
   verifyJwt,
    verifyPermission([Role.ADMIN]),
    validateId(),
    validate,
    changeOrganizerStatus(),
    validate,
    changeOrganizerController
  );

/** ********************************* All organizer opne api ************************* */
router.route("/all").get(getAllOrganizerByAdmin);
export default router;
