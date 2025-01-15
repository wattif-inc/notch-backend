import { Router } from "express";
import {
  createAccount,
  createOrganisation,
  getAllAccounts,
  createSpaceWithDevices,
  getAllSpacesWithDevices,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/create-organisation").post(createOrganisation);
router.route("/accounts").get(getAllAccounts);
router.route("/createSpace").post(createSpaceWithDevices);
router.route("/spaces").get(getAllSpacesWithDevices);

export default router;
