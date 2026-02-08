import { desc } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
})

export const courses = pgTable('courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull().unique(),
    description: text('description')
})