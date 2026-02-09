# O que foi usado no projeto

npm init -y

npm i

npm i fastify

npm i typescript @types/node -D 

npx tsx --init     

Escolha qual é a sua versão do node cole no arquivo tsconfig
https://github.com/tsconfig/bases?tab=readme-ov-file

npm i pino-pretty

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

No projeto vamos usar: postgres, drizzle, fastify e docker. O backend será deito com typescript e Node.js

ORM é uma ferramenta que facilita na hora de trabalhar com banco de dados
 
Migrations - Versionamento do Banco de dados

Para subir o banco de dados

docker-compose up -d

Para criar o drizzle

npm i drizzle-kit -D
npm i drizzle-orm pg

npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio

npm i zod
npm i zod fastify-type-provider-zod

// gerar documentaçao com open api
npm i @fastify/swagger
npm i @fastify/swagger-ui

scalar fastify

npm install @scalar/fastify-api-reference