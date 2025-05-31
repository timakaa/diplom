import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";

// Create adapter only if database is available
// During build time, db might be null, so we handle it gracefully
export const authAdapter = db ? DrizzleAdapter(db) : null;
