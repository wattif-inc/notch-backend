import { Router } from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingsController.js";

const router = Router();

router.route("/create").post(createBuilding);
router.route("/organization/:id").get(getAllBuildings);
router.route("/:id").get(getBuildingById);
router.route("/:id").put(updateBuilding);
router.route("/:id").delete(deleteBuilding);

export default router;
