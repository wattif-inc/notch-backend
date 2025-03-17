import { Router } from "express";
import {
  createOrganization,
  inviteUser,
  createUser,
  getAllAccountsFauna,
  getAllUsers,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/create-organization").post(createOrganization);
router.route("/invite-user").post(inviteUser);
router.route("/create-user").post(createUser);

router.route("/accounts").get(getAllAccountsFauna);
router.route("/users").get(getAllUsers);

export default router;
