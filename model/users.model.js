import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  phone:{
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "trainer", "member"],
    default: "member",

  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  membershipId: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: { type: Date },

  refreshToken: { type: String }, // last valid refresh token (rotation)
  deletedAt: { type: Date }



},{
  timestamps: true,
});


// userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);
