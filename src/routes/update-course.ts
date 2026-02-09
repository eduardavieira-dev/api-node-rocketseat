import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { eq } from 'drizzle-orm'
import { uuid, z} from 'zod'

export const updateCourseRoute: FastifyPluginAsyncZod = async (server) => {
    // Rota para atualizar um curso
    server.put('/courses/:id', {
        schema: {
            tags: ['Courses'],
            summary: 'Update a course',
            description: 'Endpoint para atualizar um curso pelo ID',
            params: z.object({
                id: uuid()
            }),
            body: z.object({
                title: z.string().optional()
            }),
            response: {
                200: z.object({
                    message: z.string()
                }),
                400: z.object({
                    message: z.string().describe('Bad Request')
                }),
                404: z.null().describe('Course not found')
            }
        }
    }, async (request, reply) => {
    
        const courseId = request.params.id
        const courseTitle = request.body.title

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
        
        return reply.status(404).send(null)

        })
            
}