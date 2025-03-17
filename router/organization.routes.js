import { Router } from "express";
import {
  getOrganization,
  getMembersInOrganization,
} from "../controllers/onboardingController.js";

const router = Router();

router.route("/").get(getOrganization);
router.route("/:id/members").get(getMembersInOrganization);

export default router;
