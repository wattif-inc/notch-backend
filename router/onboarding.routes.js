import { Router } from "express";
import {
  createAccount,
  createOrganization,
  getAllAccounts,
  createSpaceWithDevices,
  getAllSpacesWithDevices,
  getOrganization,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/create-organization").post(createOrganization);
router.route("/accounts").get(getAllAccounts);
router.route("/organization").get(getOrganization);
router.route("/createSpace").post(createSpaceWithDevices);
router.route("/spaces").get(getAllSpacesWithDevices);

export default router;
