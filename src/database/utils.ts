import { db } from "./db.js"
import { logger } from "../logging/logger.js"
import { eq } from "drizzle-orm"
import { userTable } from "./schema/user.js"

// USERS TABLE
export const saveUserToDB = async (values: any) => {
    try {
        await db.insert(userTable).values({
            ...values
        })
    } catch(error: any) {
        logger.error(`ERROR: saveUserToDB: ${error}`);
        throw error
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.select().from(userTable).where(eq(userTable.email, email));
        return user
    } catch(error: any) {
        logger.error(`ERROR: checkUserExists: ${error}`);
        throw error
    }
}