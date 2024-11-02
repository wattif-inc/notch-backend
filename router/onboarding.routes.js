import { Router } from "express";
import {
  createAccount,
  createOrganisation,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/createOrganisation").post(createOrganisation);

export default router;
