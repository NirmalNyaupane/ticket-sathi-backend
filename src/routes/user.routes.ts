import { Router } from "express";
import {
  getCurrentUser,
  updateUser,
} from "../controllers/user/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import userUpdateValidation from "../validators/user/updateUserValidation.js";
import validate from "../validators/validate.js";
const router = Router();

router
  .route("/current-user")
  .get(verifyJwt, getCurrentUser)
  .patch(
    verifyJwt,
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    userUpdateValidation(),
    validate,
    updateUser
  );
export default router;
