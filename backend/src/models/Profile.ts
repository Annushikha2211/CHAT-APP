import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProfile extends Document {
  user: Types.ObjectId;
  username: string;
  bio: string;
  profilePhoto: string;
}

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 150,
    },

    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>(
  "Profile",
  profileSchema
);