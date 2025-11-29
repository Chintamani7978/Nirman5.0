import cron from "node-cron";
import Alias from "../models/Alias.js";

cron.schedule("0 * * * *", async () => {
  await Alias.deleteMany({ expiresAt: { $lte: new Date() } });
  console.log("Expired aliases removed");
});


