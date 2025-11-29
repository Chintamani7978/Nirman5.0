import mongoose from "mongoose";

const aliasSchema = new mongoose.Schema({
  alias: String,
  type: { type: String, enum: ["email", "phone"] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  // Duration in milliseconds for how long this alias should remain active
  expiryDuration: Number,
  isPremium: Boolean,
});

export default mongoose.model("Alias", aliasSchema);


