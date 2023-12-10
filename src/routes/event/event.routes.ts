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
import {
  createEventCategory,
  getAllCategory,
  updateCategory,
} from "../../controllers/event/eventCategory.controller.js";
const router = Router();

router.use(verifyJwt);
router.use(verifyPermission([Role.ORGANIZER]));
router
  .route("/category")
  .get(getAllCategory)
  .post(eventCategoryValidation(), validate, createEventCategory);

router
  .route("/category/:id")
  .patch(eventCategoryUpdateValidaton(), validate, updateCategory)
  .delete(deleteCategoryValidation(), validate);
export default router;
