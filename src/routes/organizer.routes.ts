import { Router } from "express";
import OrganizerModel from "../models/organizer.model.js";
import ApiResponse from "../utils/ApiResponse.js";
const router = Router();

router.route("/register").post(async (req, res) => {
    const organizer = OrganizerModel.findAll();

    res.status(200).json(new ApiResponse(200,organizer,"sucess"))
});


export default router;