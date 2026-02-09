import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwaggerUi} from '@fastify/swagger-ui'
import { fastifySwagger} from '@fastify/swagger'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { updateCourseRoute } from './src/routes/update-course.ts'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'
import { create } from 'node:domain'
import { createCourseRoute } from './src/routes/create-course.ts'
import { deleteCourseRoute } from './src/routes/delete-course.ts'
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
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Desafio Node.js - Rocketseat',
            description: 'API para gerenciamento de cursos usando Fastify, Drizzle ORM e Zod',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
})

// transforma os dados de entrada usando o zod, garantindo que a validação seja feita corretamente
server.setValidatorCompiler(validatorCompiler)
// transforma os dados de saída usando o zod, garantindo que a resposta esteja no formato esperado
server.setSerializerCompiler(serializerCompiler)


const routes = [
  getCoursesRoute,
  getCourseByIdRoute,
  createCourseRoute,
  updateCourseRoute,
  deleteCourseRoute,
]

routes.forEach(route => server.register(route))



// server.delete('/courses/:id', async (request, reply) => {
//     type Params = {
//         id: string
//     }

//     const params = request.params as Params
//     const courseId = params.id

//     const result = await db
//     .delete(courses)
//     .where(eq(courses.id, courseId))
//     .returning()

//     if (result.length > 0) {
//         return reply.status(204).send()
//     }
    
//     return reply.status(404).send({message: 'Course not found'})

// })

server.listen({port: 3333}).then(() => {
  console.log('Server is running on port 3333')
})