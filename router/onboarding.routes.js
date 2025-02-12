import { Router } from "express";
import {
  createAccount,
  createOrganization,
  getAllAccounts,
  getOrganization,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/create-organization").post(createOrganization);
router.route("/accounts").get(getAllAccounts);
router.route("/organization").get(getOrganization);

export default router;
