import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import { eq } from 'drizzle-orm'
import { uuid, z} from 'zod'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    // Rota para listar todos os cursos
    server.get('/courses/:id', {
        schema: {
            tags: ['Courses'],
            summary: 'Get course by ID',
            description: 'Endpoint para listar um curso pelo ID',
            params: z.object({
                id: uuid()
            }),
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                            description: z.string().nullable(),
                        })
                    )
                }),
                404: z.null().describe('Course not found')
            },
        }
    }, async (request, reply)=> {
    
        const courseId = request.params.id

        const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1)
    
        if(result.length > 0) {
            return reply.send({courses: result})
        }

        return reply.status(404).send(null)
    })
}