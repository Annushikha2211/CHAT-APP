import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  name?: string;
  password?: string;
  purpose: "signup" | "reset";
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    password: {
      type: String,
    },

    purpose: {
      type: String,
      enum: ["signup", "reset"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOTP>("OTP", otpSchema);