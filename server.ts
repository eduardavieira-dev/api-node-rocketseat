import fastify from 'fastify'
import crypto from 'node:crypto'
import { type } from 'node:os'

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

const courses = [
  { id: '1', title: 'NodeJS' },
  { id: '2', title: 'ReactJS' },
  { id: '3', title: 'React Native' }
]

server.get('/courses', (request, reply)=> {
    return reply.send({courses})
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id
    const course = courses.find(course => course.id === courseId)

    if (course) {
        return reply.send({course})
    }
    
    return reply.status(404).send({message: 'Course not found'})
})

server.post('/courses', (request, reply) => {

    type Body = {
        title: string
    }

    const body = request.body as Body

    const courseId = crypto.randomUUID()
    const courseTitle = body.title

    if(!courseTitle) {
        return reply.status(400).send({message: 'Title is required'})
    }

    courses.push({ id: courseId, title: courseTitle })

    return reply.status(201).send({courseId})
})

server.put('/courses/:id', (request, reply) => {

    type Body = {
        id: string,
        title: string
    }

    const body = request.body as Body

    const courseId = body.id
    const courseTitle = body.title

    if(!courseTitle) {
        return reply.status(400).send({message: 'Title is required'})
    }

    const courseIndex = courses.findIndex(course => course.id === courseId)

    if (courseIndex >= 0) {
        courses[courseIndex].title = courseTitle
        return reply.send({message: 'Course updated successfully'})
    }
    
    return reply.status(404).send({message: 'Course not found'})

})

server.delete('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id
    const courseIndex = courses.findIndex(course => course.id === courseId)

    if (courseIndex >= 0) {
        courses.splice(courseIndex, 1)
        return reply.status(204).send()
    }
    
    return reply.status(404).send({message: 'Course not found'})

})

server.listen({port: 3333}).then(() => {
  console.log('Server is running on port 3333')
})