import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { verifyPermission } from "../../middlewares/auth.middleware.js";
import { Role } from "../../types/enum.js";
import ticketValidation, {
  updateTicketValidation,
  validateId,
} from "../../validators/event/ticketet.validation.js";
import validate from "../../validators/validate.js";
import {
  createEventTicket,
  updateTicket,
  deleteTicket,
} from "../../controllers/event/ticket.event.js";

const router = Router();

//making router
router
  .route("/")
  .post(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    ticketValidation(),
    validate,
    createEventTicket
  );

router
  .route("/:id")
  .patch(
    verifyJwt,
    verifyPermission([Role.ORGANIZER]),
    updateTicketValidation(),
    validate,
    updateTicket
  )
  .delete(validateId(), validate, deleteTicket);

export default router;
