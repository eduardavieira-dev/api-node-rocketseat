import { desc } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";


export const userRole = pgEnum('user_role', [
  'student',
  'manager'
])

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: userRole('role').notNull().default('student')
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