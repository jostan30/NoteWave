import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  dob: Date;
  otp: string;
  otpExpiry: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob:{type:Date,required:true},
  otp: { type: String },
  otpExpiry: { type: Date },
});

export default mongoose.model<IUser>("User", userSchema);
