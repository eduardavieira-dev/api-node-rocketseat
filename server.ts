import { eq } from 'drizzle-orm'
import fastify from 'fastify'
import crypto from 'node:crypto'
import { type } from 'node:os'
import { db } from './src/database/client.ts'
import { courses } from './src/database/schema.ts'

const server = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    }
})

server.get('/courses', async (request, reply)=> {

    const result = await db.select().from(courses)

    return reply.send({courses: result})
})

server.get('/courses/:id', async (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1)

    if (result.length > 0) {
        return {course: result[0]}
    }
    
    return reply.status(404).send({message: 'Course not found'})
})

server.post('/courses', async (request, reply) => {

    type Body = {
        title: string
    }

    const body = request.body as Body

    const courseTitle = body.title

    if(!courseTitle) {
        return reply.status(400).send({message: 'Title is required'})
    }

    const result = await db.insert(courses).values({
        title: courseTitle
    }).returning()

    return reply.status(201).send({courseId:result[0].id})
})

server.put('/courses/:id', async (request, reply) => {

    type Params = {
    id: string
  }

  type Body = {
    title: string
  }

  const params = request.params as Params
  const body = request.body as Body

  const courseId = params.id
  const courseTitle = body.title

    if(!courseTitle) {
        return reply.status(400).send({message: 'Title is required'})
    }

    const result = await db
    .update(courses)
    .set({title: courseTitle})
    .where(eq(courses.id, courseId))
    .returning()

    if (result.length > 0) {
        return reply.send({message: 'Course updated successfully'})
    }
    
    return reply.status(404).send({message: 'Course not found'})

})

server.delete('/courses/:id', async (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id

    const result = await db
    .delete(courses)
    .where(eq(courses.id, courseId))
    .returning()

    if (result.length > 0) {
        return reply.status(204).send()
    }
    
    return reply.status(404).send({message: 'Course not found'})

})

server.listen({port: 3333}).then(() => {
  console.log('Server is running on port 3333')
})