import { Router } from "express";
import {
  registerUserController,
  emailVerificationController,
  loginController,
  initiatePasswordResetController,
  finalizePasswordResetController,
  resendEmailVerificationController,
} from "../controllers/auth.controller.js";
import {
  userLoginValidation,
  userRegisterValidators,
  initiatePasswordResetValidation,
  finalizePasswordResetValidation,
} from "../validators/auth/userRegister.validate.js";
import optValidators from "../validators/otp/optValidators.js";
import validate from "../validators/validate.js";

const router = Router();

router
  .route("/register")
  .post(userRegisterValidators(), validate, registerUserController);

router.route("/login").post(userLoginValidation(), validate, loginController);

router
  .route("/email-verification")
  .post(optValidators(), validate, emailVerificationController);

router
  .route("/initiate-password-reset")
  .post(
    initiatePasswordResetValidation(),
    validate,
    initiatePasswordResetController
  );

router
  .route("/finalize-password-reset")
  .post(
    finalizePasswordResetValidation(),
    validate,
    finalizePasswordResetController
  );

router
  .route("/resend-email-verification")
  .post(
    initiatePasswordResetValidation(),
    validate,
    resendEmailVerificationController
  );
export default router;
