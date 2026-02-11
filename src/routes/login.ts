//Gabriel25@yahoo.com //123456

import type {FastifyPluginAsyncZod} from 'fastify-type-provider-zod'
import { db } from "../database/client.ts"
import { courses, users } from "../database/schema.ts"
import { z, string, email } from "zod"
import { eq } from "drizzle-orm"
import { verify } from 'argon2'
import jwt from "jsonwebtoken"

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
   
   // Rota para criar um novo curso
   server.post('/sessions', {
       schema: {
            tags: ['Auth'],
            summary: 'Login a new user',
            description: 'Endpoint para autenticar um usuário',
           body: z.object({
               email: z.email(),
               password: z.string()
           }), 
           response: {
               200: z.object({
                   token: z.string()
               }),
               400: z.object({
                   message: z.string()
               }),
           }
       },
   }, async (request, reply) => {
   
       const { email, password } = request.body
   
       const result = await db
       .select()
       .from(users)
       .where(eq(users.email, email))
   

       if(result.length === 0){
            return reply.status(400).send({message: 'Invalid credentials'})
       }

       const user = result[0]

         // Verificar a senha usando argon2
         const doesPasswordMatch = await verify(user.password, password)

         if (!doesPasswordMatch) {
             return reply.status(400).send({ message: 'Invalid credentials' })
         }

         if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be set.')
        }
        
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)
  
   
       return reply.status(200).send({token})
   })
   
}