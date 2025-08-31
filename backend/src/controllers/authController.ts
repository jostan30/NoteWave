import { Request, Response } from "express";
import { sendOTP, verifyOTP } from "../utils/otp";

// Signup/Login: send OTP
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { name, email, dob } = req.body;

    await sendOTP(email, name, dob);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

// Verify OTP
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOTP(email, otp);

    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "OTP verification failed" });
  }
};
