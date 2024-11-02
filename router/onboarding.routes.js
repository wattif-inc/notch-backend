import { Router } from "express";
import {
  createAccount,
  createOrganisation,
  createSpaceWithDevices,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/createOrganisation").post(createOrganisation);
router.route("/createSpace").post(createSpaceWithDevices);

export default router;
