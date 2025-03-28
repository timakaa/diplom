import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  serial,
  boolean,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Определяем enum для планов подписки
export const userPlanEnum = {
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};

// Определяем enum для статусов ставок
export const bidStatusEnum = {
  ACTIVE: "active", // Активная ставка
  WON: "won", // Выигравшая ставка
  OUTBID: "outbid", // Перебитая ставка
  EXPIRED: "expired", // Истекшая ставка (аукцион закончился)
};

// --- USERS ---
export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  plan: text("plan", { enum: Object.values(userPlanEnum) }),
  balance: decimal("balance", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
});

// --- ACCOUNTS ---
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_user_id_idx").on(account.userId),
  }),
);

// --- SESSIONS ---
export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("sessions_user_id_idx").on(session.userId),
  }),
);

// --- VERIFICATION TOKENS ---
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// --- AUCTIONS ---
export const auctions = pgTable("auctions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startingPrice: decimal("starting_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  status: text("status").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- FAVORITES ---
export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    auctionId: integer("auction_id")
      .notNull()
      .references(() => auctions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (favorite) => ({
    // Индекс для быстрого поиска избранных конкретного пользователя
    userIdIdx: index("favorites_user_id_idx").on(favorite.userId),
    // Уникальный индекс для пары пользователь-аукцион
    uniqueFavorite: uniqueIndex("unique_favorite_idx").on(
      favorite.userId,
      favorite.auctionId,
    ),
  }),
);

// --- BIDS (СТАВКИ) ---
export const bids = pgTable(
  "bids",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    auctionId: integer("auction_id")
      .notNull()
      .references(() => auctions.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status", { enum: Object.values(bidStatusEnum) })
      .notNull()
      .default(bidStatusEnum.ACTIVE),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (bid) => ({
    // Индекс для быстрого поиска ставок конкретного пользователя
    userIdIdx: index("bids_user_id_idx").on(bid.userId),

    // Индекс для быстрого поиска ставок по конкретному аукциону
    auctionIdIdx: index("bids_auction_id_idx").on(bid.auctionId),

    // Составной индекс для пагинации ставок пользователя по дате создания
    userTimeIdx: index("bids_user_time_idx").on(bid.userId, bid.createdAt),

    // Составной индекс для пагинации ставок аукциона по сумме (для определения максимальной ставки)
    auctionAmountIdx: index("bids_auction_amount_idx").on(
      bid.auctionId,
      bid.amount,
    ),

    // Составной индекс для пагинации ставок по статусу и дате (для фильтрации)
    statusTimeIdx: index("bids_status_time_idx").on(bid.status, bid.createdAt),
  }),
);
