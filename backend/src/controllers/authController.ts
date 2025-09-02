import { Request, Response } from "express";
import { sendOTP, verifyOTP } from "../utils/otp";
import User from "../models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Signup/Login: send OTP
export const requestOtpSignIn = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.find({ email });

    if(!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const  otpSent = await sendOTP(email);
    if(!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

export const requestOtpSignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, dob } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, dob });
    const  otpSent = await sendOTP(email);

    if(!otpSent) {
      return res.status(400).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({ message: `OTP sent to ${user.email}`  });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

// Verify OTP
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOTP(email, otp);

    const salt = crypto.randomBytes(16).toString("hex");

    // JWT payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      salt, // 🔐 unique per token
    };

    // Sign JWT with expiry
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "OTP verification failed",
    });
  }
};