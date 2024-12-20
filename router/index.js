import { Router } from "express";
import onboardingRouter from "./onboarding.routes.js";

const router = Router();

router.use("/onboarding", onboardingRouter);

export default router;
