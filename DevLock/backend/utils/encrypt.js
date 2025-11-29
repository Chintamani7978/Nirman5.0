import crypto from "crypto";

export const encrypt = (text) =>
  crypto.createHash("sha256").update(text).digest("hex");


