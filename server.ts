import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger} from '@fastify/swagger'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { updateCourseRoute } from './src/routes/update-course.ts'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'
import { create } from 'node:domain'
import { createCourseRoute } from './src/routes/create-course.ts'
import { deleteCourseRoute } from './src/routes/delete-course.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'
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

server.register(scalarAPIReference, {
  routePrefix: '/docs',
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


server.listen({port: 3333}).then(() => {
  console.log('Server is running on port 3333')
})