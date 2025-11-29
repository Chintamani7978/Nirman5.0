import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  aliasId: { type: mongoose.Schema.Types.ObjectId, ref: "Alias" },
  sender: String,
  content: String,
  otp: String,
  receivedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);


