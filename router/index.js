import { Router } from "express";
import onboardingRouter from "./onboarding.routes.js";
import spaceRouter from "./space.routes.js";


const router = Router();

router.use("/onboarding", onboardingRouter);
router.use("/space", spaceRouter);


export default router;
