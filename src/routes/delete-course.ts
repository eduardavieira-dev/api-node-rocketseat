import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { eq } from 'drizzle-orm'
import { uuid, z} from 'zod'
import { request } from 'https'

export const deleteCourseRoute: FastifyPluginAsyncZod = async (server) => {
    // Rota para deletar um curso
    server.delete('/courses/:id',{
        schema: {
            tags: ['Courses'],  
            summary: 'Delete a course',
            description: 'Endpoint para deletar um curso pelo ID',
            params: z.object({
                id: uuid()
            }),
            response: {
                204: z.null().describe('No Content'),
                404: z.null().describe('Course not found')
            }
        }
    }, async (request, reply) => {
    
        const courseId = request.params.id

        const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)

        if(course.length > 0) {
            await db.delete(courses).where(eq(courses.id, courseId))
            return reply.status(204).send(null)
        }
        
        return reply.status(404).send(null)

    })
}