import {drizzle} from "drizzle-orm/node-postgres"

import { Config } from "../config/config.js"

const dbUrl = `postgresql://${Config.POSTGRES.POSTGRES_USER}:${Config.POSTGRES.POSTGRES_PASSWORD}@${Config.POSTGRES.POSTGRES_HOST}:${Config.POSTGRES.POSTGRES_PORT}/${Config.POSTGRES.POSTGRES_DB}`

export const db = drizzle(dbUrl)