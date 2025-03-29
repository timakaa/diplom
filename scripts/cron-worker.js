import "dotenv/config";
import cron from "node-cron";
import { generateRandomAuctions } from "../lib/utils/auction-generator.js";

// Schedule: every 5 minutes
const schedule = "*/1 * * * *";

console.log("Starting cron worker...");

// Create cron job
const job = cron.schedule(schedule, async () => {
  try {
    console.log("Starting scheduled auction generation...");
    const count = Math.floor(Math.random() * 3) + 1;
    const auctions = await generateRandomAuctions(count);
    console.log(`Successfully generated ${auctions.length} new auctions`);
  } catch (error) {
    console.error("Error in scheduled auction generation:", error);
  }
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Stopping cron job...");
  job.stop();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Stopping cron job...");
  job.stop();
  process.exit(0);
});
