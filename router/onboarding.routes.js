import { Router } from "express";
import {
  createAccount,
  createOrganization,
  inviteUser,
  getAllAccounts,
  getOrganization,
  getAllUsers,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/create-organization").post(createOrganization);
router.route("/invite-user").post(inviteUser);
router.route("/create-account").post(createAccount);
router.route("/accounts").get(getAllAccounts);
router.route("/organization").get(getOrganization);
router.route("/users").get(getAllUsers);

export default router;
