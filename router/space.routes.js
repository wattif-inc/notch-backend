import { Router } from "express";
import {
  createSpaceWithDevices,
  getAllSpacesWithDevices,
} from "../controllers/spaceController.js";

const router = Router();

router.route("/").get(getAllSpacesWithDevices);
router.route("/create").post(createSpaceWithDevices);

export default router;
