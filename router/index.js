import { Router } from "express";
import onboardingRouter from "./onboarding.routes.js";
import organizationRouter from "./organization.routes.js";

import spaceRouter from "./space.routes.js";
import devicesRouter from "./devices.routes.js";

const router = Router();

router.use("/onboarding", onboardingRouter);
router.use("/organization", organizationRouter);
router.use("/space", spaceRouter);
router.use("/devices", devicesRouter);

export default router;
