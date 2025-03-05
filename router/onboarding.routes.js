import { Router } from "express";
import {
  createAccount,
  createOrganization,
  getAllAccounts,
  getOrganization,
  getAllUsers,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/createAccount").post(createAccount);
router.route("/create-organization").post(createOrganization);
router.route("/accounts").get(getAllAccounts);
router.route("/organization").get(getOrganization);
router.route("/users").get(getAllUsers);

export default router;
