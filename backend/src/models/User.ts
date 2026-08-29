import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
  type: String,
  unique: true,
  sparse: true,
  trim: true,
},

bio: {
  type: String,
  default: "",
  trim: true,
},

profileImage: {
  type: String,
  default: "",
},

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;