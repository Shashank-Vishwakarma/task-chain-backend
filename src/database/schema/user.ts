import {pgTable, varchar, uuid, boolean, date} from "drizzle-orm/pg-core"

export const userTable = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    provider: varchar("provider").notNull(),
    profileUrl: varchar("profile_url"),
    isVerified: boolean("is_verified").default(false),
    otpExpiresAt: date("otp_expires_at").default(null),
    otp: varchar("otp").default(""),
})
