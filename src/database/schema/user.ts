import {pgTable, varchar, uuid} from "drizzle-orm/pg-core"
import { db } from "../db.js"
import { logger } from "../../logging/logger.js"
import { eq } from "drizzle-orm"

export const userTable = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
})

export const saveUserToDB = async (values: any) => {
    try {
        const user = await db.insert(userTable).values({
            ...values
        }).returning({
            id: userTable.id,
            name: userTable.name,
            email: userTable.email
        })

        return user[0]
    } catch(error: any) {
        logger.error(`ERROR: saveUserToDB: ${error}`);
        throw error
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
        return user
    } catch(error: any) {
        logger.error(`ERROR: checkUserExists: ${error}`);
        throw error
    }
}