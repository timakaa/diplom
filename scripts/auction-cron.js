import "dotenv/config";
import cron from "node-cron";
import { finalizeCompletedAuctions } from "../lib/utils/auction-finalizer.js";

// Schedule: every 5 minutes
const schedule = "*/1 * * * *";

console.log("Starting auction finalizer cron worker...");
console.log(`Scheduled to run every 5 minutes (${schedule})`);

// Create cron job
const job = cron.schedule(schedule, async () => {
  try {
    console.log(
      `[${new Date().toISOString()}] Running auction finalization...`,
    );

    const processedCount = await finalizeCompletedAuctions();

    console.log(`Finalization complete: processed ${processedCount} auctions`);
  } catch (error) {
    console.error("Error in auction finalization job:", error);
  }
});

// For testing - run immediately on start
(async () => {
  try {
    console.log("Running initial check on startup...");
    const processedCount = await finalizeCompletedAuctions();
    console.log(`Initial check complete: processed ${processedCount} auctions`);
  } catch (error) {
    console.error("Error in initial check:", error);
  }
})();

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
