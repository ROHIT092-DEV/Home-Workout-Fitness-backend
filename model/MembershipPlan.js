import mongoose, { Schema } from "mongoose";

const membershipPlanShema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true }, // e.g., 30, 90, 365
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MembershipPlan = mongoose.model(
  "MembershipPlan",
  membershipPlanShema
);
