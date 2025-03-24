import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./index";

// Создаем адаптер напрямую, без передачи отдельных таблиц
export const authAdapter = DrizzleAdapter(db);
