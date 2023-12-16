import { Router } from "express";
import { createCoupon } from "../../validators/event/coupon.validation.js";
import validate from "../../validators/validate.js";
import {
  verifyJwt,
  verifyPermission,
} from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import {
  createCouponController,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
} from "../../controllers/event/coupon.controller.js";
import { validateId } from "../../validators/event/ticketet.validation.js";
const router = Router();

router
  .route("/")
  .post(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    createCoupon(),
    validate,
    createCouponController
  )
  .get(verifyJwt, verifyPermission([Role.ORGANIZER]), validate, getAllCoupons);

router
  .route("/:id")
  .delete(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    validateId(),
    validate,
    deleteCoupon
  )
  .patch(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    validateId(),
    validate,
    updateCoupon
  );
export default router;
