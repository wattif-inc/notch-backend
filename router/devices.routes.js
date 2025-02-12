import { Router } from "express";
import {
  createAppliances,
  getAllAppliances,
  createSensor,
  getAllSensors,
} from "../controllers/devicesController.js";

const router = Router();

router.route("/appliances").get(getAllAppliances);
router.route("/appliances/create").post(createAppliances);

router.route("/sensors").get(getAllSensors);
router.route("/sensors/create").post(createSensor);

export default router;
