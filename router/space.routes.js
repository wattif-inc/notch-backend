import { Router } from "express";
import {
  createSpaceWithDevices,
  getAllSpacesWithDevices,
  createWorkSpace,
  getAllworkspaces,
} from "../controllers/spaceController.js";

const router = Router();

router.route("/").get(getAllSpacesWithDevices);
router.route("/create").post(createSpaceWithDevices);

router.route("/workspaces").get(getAllworkspaces);
router.route("/workspaces/create").post(createWorkSpace);

export default router;
