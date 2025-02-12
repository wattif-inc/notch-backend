import { Router } from "express";
import {
  createAppliances,
  getAllAppliances,
} from "../controllers/devicesController.js";

const router = Router();

router.route("/appliances").get(getAllAppliances);
router.route("/appliances/create").post(createAppliances);

export default router;
