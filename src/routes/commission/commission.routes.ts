import { Router } from "express";
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import { createCommissionValidators } from "../../validators/commission/commissionValidation.js";
import validate from "../../validators/validate.js";
import { commissionController,getCommissionController} from "../../controllers/commission/commission.controller.js";
const router = Router();
router.use(verifyJwt);
router.use(verifyPermission([Role.ADMIN]));
router
  .route("/")
  .post(createCommissionValidators(), validate, commissionController)
  .get(getCommissionController);

export default router;
