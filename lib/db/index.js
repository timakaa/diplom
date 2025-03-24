import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Строка подключения к PostgreSQL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Создание клиента postgres-js для PostgreSQL
const client = postgres(connectionString);

// Создание экземпляра Drizzle с вашей схемой для запросов ORM
export const db = drizzle(client, { schema });
