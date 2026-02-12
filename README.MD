# Desafio API Node (Rocketseat)

API construída durante um intensivo da Rocketseat sobre desenvolvimento de APIs com Node.js. Este README explica o que o projeto faz, como rodar localmente e como testar de forma rápida.

Por que testar este projeto?

- TypeScript com estrutura simples e organizada.
- Autenticação JWT com controle de roles (`student` / `manager`).
- Migrations e seed com Drizzle para setup rápido.
- Testes end-to-end com `vitest` e `supertest`.

## Recursos implementados

- CRUD de cursos (create, read, update, delete)
- Autenticação por token JWT (rota `/sessions`)
- Hash de senhas com `argon2`
- Proteção de rotas com hooks (`checkRequestJWT` e `checkUserRole`)
- Migrations e seed para popular dados de exemplo
- Testes automatizados cobrindo os principais fluxos

## Tecnologias

- Node.js + TypeScript
- Fastify
- PostgreSQL (via Docker)
- Drizzle ORM / drizzle-kit
- Zod (validação)
- Argon2 (hash de senhas)
- JSON Web Token (`jsonwebtoken`)
- Vitest + Supertest (testes)

## Estrutura do projeto (resumo)

- `src/app.ts` — inicialização do servidor
- `src/server.ts` — registro de rotas
- `src/database/` — `client.ts`, `schema.ts`, `seed.ts`
- `src/hooks/` — `check-request-jwt.ts`, `check-user-role.ts`
- `src/routes/` — endpoints e testes
- `src/tests/factories/` — helpers para criação de dados nos testes
- `requisicoes.http` — coleção pronta para uso no VS Code Rest Client

## Documentação da API 

A API implementa um sistema de gerenciamento de cursos com autenticação JWT e controle de acesso baseado em roles.

### Características Principais

- **Autenticação JWT**: Sistema seguro de autenticação com tokens JWT
- **Controle de Acesso**: Dois tipos de roles (`student` e `manager`)
- **CRUD Completo**: Operações de criação, leitura, atualização e exclusão de cursos
- **Hash de Senhas**: Utiliza argon2 para segurança
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Migrations e Seeds**: Setup automatizado do banco de dados
- **Testes E2E**: Cobertura de testes com vitest e supertest
- **Documentação Interativa**: Acesse `/docs` para visualizar e testar a API através da interface Scalar

### Endpoints Principais

- `POST /sessions` - Autenticação e geração de token JWT
- `GET /courses` - Listar todos os cursos
- `POST /courses` - Criar novo curso (requer manager)
- `PUT /courses/:id` - Atualizar curso (requer manager)
- `DELETE /courses/:id` - Deletar curso (requer manager)

### Testando a API

1. Inicie a aplicação com `npm run dev`
2. Acesse `http://localhost:3333/docs` para visualizar a documentação interativa do Scalar
3. Utilize a interface para autenticar e testar todos os endpoints diretamente no navegador
4. Ou use o arquivo `requisicoes.http` com a extensão REST Client do VS Code para testar os endpoints
5. Ou utilize os exemplos formatados com cURL fornecidos neste README


## Pré-requisitos

- Node.js >= 18
- Docker (para o PostgreSQL)

## Variáveis de ambiente

Copie o conteúdo abaixo para um arquivo `.env` na raiz do projeto:

```dotenv
NODE_ENV=development
DATABASE_URL="postgres://postgres:postgres@localhost:5433/desafio_node_rocketseat"
JWT_SECRET="your_jwt_secret_key"
```

## Passo-a-passo para rodar localmente

1. Instale dependências

```bash
npm install
```

2. Inicialize o banco com Docker

```bash
npm run docker
```

3. Gere e aplique migrations (Drizzle)

```bash
npm run db:generate
npm run db:migrate
```

4. Rode o seed para popular dados de exemplo

```bash
npm run db:seed
```

5. Inicie a aplicação

```bash
npm run dev
```

6. Rode os testes

```bash
npm run test
```

## Exemplos de uso (cURL)

1) Obter token (manager)

```bash
curl -X POST http://localhost:3333/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email":"manager@email.com","password":"123456"}'
```

Resposta: `{ "token": "..." }` — copie o token para as requests protegidas.

2) Criar curso (requer manager)

```bash
curl -X POST http://localhost:3333/courses \
  -H 'Content-Type: application/json' \
  -H 'Authorization: <TOKEN>' \
  -d '{"title":"Curso de JavaScript"}'
```

3) Atualizar curso (requer manager)

```bash
curl -X PUT http://localhost:3333/courses/<COURSE_ID> \
  -H 'Content-Type: application/json' \
  -H 'Authorization: <TOKEN>' \
  -d '{"title":"Novo título"}'
```

4) Deletar curso (requer manager)

```bash
curl -X DELETE http://localhost:3333/courses/<COURSE_ID> \
  -H 'Authorization: <TOKEN>'
```

## Testes

- `npm run test` executa os testes com o ambiente de teste configurado.
- O projeto inclui testes para criação, listagem, busca, atualização e remoção de cursos, além de validações de autorização.

## Scripts úteis (`package.json`)

```json
"scripts": {
  "dev": "node --env-file .env --watch src/server.ts",
  "docker": "docker-compose up -d",
  "db:seed": "node --env-file .env src/database/seed.ts",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "pretest": "dotenv -e .env.test drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "test": "dotenv -e .env.test vitest run --coverage"
}
```

## Comandos utilizados durante o desenvolvimento

Estes são os comandos que foram usados enquanto o projeto era construído — servem como referência rápida:

```bash
npm init -y
npm install
npm i fastify
npm i typescript @types/node -D
npx tsx --init
npm i pino-pretty
npm i drizzle-kit -D
npm i drizzle-orm pg
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio
npm i zod fastify-type-provider-zod
npm i @fastify/swagger @fastify/swagger-ui
npm install @scalar/fastify-api-reference
npm i @faker-js/faker -D
npm i vitest -D
npm i -D supertest @types/supertest
npm i dotenv-cli -D
npm i @vitest/coverage-v8
npm i -D @vitest/coverage-istanbul
npm i argon2
npm i jsonwebtoken @types/jsonwebtoken -D
```


## Como funciona o JWT (breve explicação)

JSON Web Token (JWT) é um formato compacto para representar claims (declarações) entre duas partes. Um token JWT típico possui três partes separadas por pontos:

- Header (cabeçalho): informa o algoritmo (ex: HS256) e o tipo (`JWT`).
- Payload (conteúdo): contém as claims, por exemplo `{ "sub": "user-id", "role": "manager" }`.
- Signature (assinatura): gerada com o header + payload e o segredo (`JWT_SECRET`). Serve para verificar que o token é autêntico.

Cada parte é codificada em Base64URL e unida por `.`: `header.payload.signature`.

Exemplo de geração/verificação no servidor:

- Geração: `jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)`
- Verificação: `jwt.verify(token, process.env.JWT_SECRET)`

Importante no cliente: enviar o token no header `Authorization` sem o prefixo `Bearer`, por exemplo:

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Se o token estiver incorreto, tiver expirado ou for enviado de forma incorreta, a validação falhará e a rota retornará `401 Unauthorized`.

## Observacoes

- Rotas protegidas exigem `Authorization: <TOKEN>`.
- O usuario manager padrao do seed e `manager@email.com` com senha `123456`.
