import { Router } from "express";
import { createBuilding } from "../controllers/buildingsController.js";

const router = Router();

// router.route("/").get(getAllSpacesWithDevices);
router.route("/create").post(createBuilding);

export default router;
