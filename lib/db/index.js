import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

// PostgreSQL connection string
const connectionString = process.env.DATABASE_URL;

// Create database connection only if DATABASE_URL is available
// During build time, this might not be available, so we handle it gracefully
let db = null;

if (connectionString) {
  try {
    // Create postgres-js client for PostgreSQL
    const client = postgres(connectionString);
    // Create Drizzle instance with your schema for ORM queries
    db = drizzle(client, { schema });
  } catch (error) {
    console.warn("Failed to create database connection:", error.message);
  }
}

// Export the database instance
// If db is null (no DATABASE_URL), operations will fail at runtime with a clear error
export { db };
