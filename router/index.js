import { Router } from "express";
import { createAccount } from "../controllers/onboardingController";

const router = Router();

router.use("/", createAccount);

export default router;
