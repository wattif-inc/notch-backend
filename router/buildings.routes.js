import { Router } from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
} from "../controllers/buildingsController.js";

const router = Router();

router.route("/create").post(createBuilding);
router.route("/organization/:id").get(getAllBuildings);
router.route("/:id").get(getBuildingById);

export default router;
