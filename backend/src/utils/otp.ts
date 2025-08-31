import crypto from "crypto";
import User from "../models/User";
import { sendEmail } from "./sendEmail";


export const generateOTP = (): string => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const sendOTP = async (email: string, name: string, dob: string) => {
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ name, email, dob });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

        user.otp = otp;
        user.otpExpiry = otpExpires;
        await user.save();

        await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
        return otp;

    } catch (error) {
        console.error(error);
    }

};

// Verify OTP
export const verifyOTP = async (email: string, otp: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        if (!user.otp || !user.otpExpiry) throw new Error("No OTP found");

        if (user.otp !== otp) throw new Error("Invalid OTP");
        if (user.otpExpiry < new Date()) throw new Error("OTP expired");

        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return user;
    } catch (error) {
        console.log(error);
    }

};
