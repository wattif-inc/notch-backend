import { Router } from "express";
import {
  createAppliances,
  getAllAppliances,
  createSensors,
  getAllSensors,
  createButtons,
  getAllbuttons,
} from "../controllers/devicesController.js";

const router = Router();

router.route("/appliances").get(getAllAppliances);
router.route("/appliances/create").post(createAppliances);

router.route("/sensors").get(getAllSensors);
router.route("/sensors/create").post(createSensors);

router.route("/buttons").get(getAllbuttons);
router.route("/buttons/create").post(createButtons);

export default router;
