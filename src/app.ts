import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger} from '@fastify/swagger'
import { getCoursesRoute } from './routes/get-courses.ts'
import { updateCourseRoute } from './routes/update-course.ts'
import { getCourseByIdRoute } from './routes/get-course-by-id.ts'
import { create } from 'node:domain'
import { createCourseRoute } from './routes/create-course.ts'
import { deleteCourseRoute } from './routes/delete-course.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { loginRoute } from './routes/login.ts'
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

if(process.env.NODE_ENV === 'development') {
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
}

server.register(scalarAPIReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'bluePlanet',
  }
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
  loginRoute
]

routes.forEach(route => server.register(route))

export {server}