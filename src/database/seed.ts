import { en } from "zod/locales";
import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";
import { fakerPT_BR as faker } from '@faker-js/faker'
import { hash } from 'argon2'

async function seed(){
    const passwordHash = await hash('123456')

    const usersInserted = await db.insert(users).values([
        { 
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: passwordHash,
            role: 'student',
        },
        { 
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: passwordHash,
            role: 'student',
        },
        { 
            name: faker.person.fullName(), 
            email: faker.internet.email(),
            password: passwordHash,
            role: 'student',
        },
        { 
            name: 'Admin Manager', 
            email: 'manager@email.com',
            password: passwordHash,
            role: 'manager',
        },
    ]).returning()

    const coursesInserted = await db.insert(courses).values([
        {title: faker.lorem.words(4)},
        {title: faker.lorem.words(4)},
    ]).returning()

    await db.insert(enrollments).values([
        {courseId: coursesInserted[0].id,userId: usersInserted[0].id},
        {courseId: coursesInserted[0].id,userId: usersInserted[1].id},
        {courseId: coursesInserted[1].id,userId: usersInserted[2].id},
    ]).returning()

    console.log('Users inserted:', usersInserted)
    console.log('Courses inserted:', coursesInserted)
}

seed()