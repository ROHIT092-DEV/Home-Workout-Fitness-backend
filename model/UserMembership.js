import mongoose, { Schema } from "mongoose";

const userMembershipSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);



export const UserMembership = mongoose.model("UserMembership", userMembershipSchema);
