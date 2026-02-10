import { desc } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { create } from "node:domain";
import { id } from "zod/locales";

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

export const enrollments = pgTable('enrollments', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id), 
    courseId: uuid('course_id').notNull().references(() => courses.id),
    createdAt: timestamp('created_at',{withTimezone: true}).notNull().defaultNow(),
},(table) => [
    uniqueIndex('user_course_unique').on(table.userId, table.courseId)
])