import { Router } from "express";
import { requestOtpSignIn, requestOtpSignUp, verifyOtpController } from "../controllers/authController";

const router = Router();

router.post("/request-otp-in", requestOtpSignIn); 

router.post("/request-otp-up", requestOtpSignUp); 

router.post("/verify-otp", verifyOtpController);

export default router;
