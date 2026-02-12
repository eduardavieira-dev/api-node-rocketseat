import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { z, string } from "zod"
import { checkUserRole } from '../hooks/check-user-role.ts'
import { checkRequestJWT } from '../hooks/check-request-jwt.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
   
   // Rota para criar um novo curso
   server.post('/courses', {
        preHandler: [
            checkRequestJWT,
            checkUserRole('manager'),
        ],
       schema: {
            tags: ['Courses'],
            summary: 'Create a new course',
            description: 'Endpoint para criar um novo curso',
           body: z.object({
               title: z.string()
           }), 
           response: {
               201: z.object({
                   courseId: z.uuid()
               })
           }
       },
   }, async (request, reply) => {
   
       const courseTitle = request.body.title
   
       const result = await db
       .insert(courses)
       .values({ title: courseTitle })
       .returning()
   
       return reply.status(201).send({courseId:result[0].id})
   })
   
}