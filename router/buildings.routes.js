import { Router } from "express";
import {
  createBuilding,
  getAllBuildings,
} from "../controllers/buildingsController.js";

const router = Router();

// router.route("/").get(getAllSpacesWithDevices);
router.route("/create").post(createBuilding);
router.route("/:id").get(getAllBuildings);

export default router;
