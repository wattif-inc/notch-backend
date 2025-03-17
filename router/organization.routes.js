import { Router } from "express";
import {
  getOrganization,
  getMembersInOrganization,
  removeOrganization,
} from "../controllers/organizationController.js";

const router = Router();

router.route("/").get(getOrganization);
router.route("/:id/members").get(getMembersInOrganization);
router.route("/:id").delete(removeOrganization);

export default router;
