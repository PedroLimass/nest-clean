# Nest Clean

API de fórum construída com **NestJS** e **Clean Architecture**, baseada no curso [05-nest-clean](https://github.com/rocketseat-education/05-nest-clean) da Rocketseat.

## Stack

- **NestJS** — framework HTTP
- **Prisma** — ORM (PostgreSQL)
- **Redis** — cache de detalhes de perguntas
- **Cloudflare R2** — armazenamento de anexos
- **JWT (RS256)** — autenticação
- **Vitest** — testes unitários e E2E
- **Scalar** — documentação interativa da API (OpenAPI)

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Arquivos `.env` e `.env.test` configurados

## Configuração

```bash
# Instalar dependências
npm install

# Subir PostgreSQL e Redis
docker-compose up -d

# Rodar migrations
npm run prisma:migrate

# Gerar client Prisma
npm run prisma:generate
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `JWT_PRIVATE_KEY` | Chave privada JWT (base64) |
| `JWT_PUBLIC_KEY` | Chave pública JWT (base64) |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare |
| `CLOUDFLARE_PUBLIC_URL` | URL pública do bucket R2 |
| `AWS_BUCKET_NAME` | Nome do bucket R2 |
| `AWS_ACCESS_KEY_ID` | Access key R2 |
| `AWS_SECRET_ACCESS_KEY` | Secret key R2 |
| `REDIS_HOST` | Host Redis (padrão: `127.0.0.1`) |
| `REDIS_PORT` | Porta Redis (padrão: `6379`) |
| `REDIS_DB` | Database Redis (padrão: `0`) |
| `PORT` | Porta da API (padrão: `3333`) |

## Executar

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API sobe em `http://localhost:3333` (ou na porta definida em `PORT`).

## Documentação da API (Scalar)

Com o servidor rodando, acesse:

| URL | Descrição |
|---|---|
| [`/docs`](http://localhost:3333/docs) | Interface Scalar — documentação interativa |
| [`/openapi.json`](http://localhost:3333/openapi.json) | Especificação OpenAPI em JSON |

### Autenticação na documentação

1. Crie uma conta em `POST /accounts` ou autentique-se em `POST /sessions`
2. Copie o `access_token` da resposta
3. No Scalar, clique em **Authorize** e informe: `Bearer <seu-token>`

Rotas públicas (sem token): `POST /accounts` e `POST /sessions`.

## Rotas

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/sessions` | Autenticar e obter JWT | Não |
| `POST` | `/accounts` | Criar conta de aluno | Não |

### Perguntas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/questions` | Listar perguntas recentes (`?page=1`) | Sim |
| `POST` | `/questions` | Criar pergunta | Sim |
| `GET` | `/questions/:slug` | Detalhes da pergunta (com cache Redis) | Sim |
| `PUT` | `/questions/:id` | Editar pergunta | Sim |
| `DELETE` | `/questions/:id` | Excluir pergunta | Sim |

### Respostas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/questions/:questionId/answers` | Listar respostas (`?page=1`) | Sim |
| `POST` | `/questions/:questionId/answers` | Responder pergunta | Sim |
| `PUT` | `/answers/:id` | Editar resposta | Sim |
| `DELETE` | `/answers/:id` | Excluir resposta | Sim |
| `PATCH` | `/answers/:answerId/choose-as-best` | Escolher melhor resposta | Sim |

### Comentários

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/questions/:questionId/comments` | Listar comentários da pergunta | Sim |
| `POST` | `/questions/:questionId/comments` | Comentar na pergunta | Sim |
| `DELETE` | `/questions/comments/:id` | Excluir comentário da pergunta | Sim |
| `GET` | `/answers/:answerId/comments` | Listar comentários da resposta | Sim |
| `POST` | `/answers/:answerId/comments` | Comentar na resposta | Sim |
| `DELETE` | `/answers/comments/:id` | Excluir comentário da resposta | Sim |

### Anexos

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/attachments` | Upload de arquivo (multipart, máx. 2MB) | Sim |

### Notificações

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `PATCH` | `/notifications/:notificationId/read` | Marcar notificação como lida | Sim |

> Notificações são criadas automaticamente por **eventos de domínio** (nova resposta, melhor resposta escolhida).

## Testes

```bash
# Unitários
npm run test

# E2E (requer Docker com Postgres e Redis)
npm run test:e2e

# Cobertura
npm run test:cov
```

## Arquitetura

```
src/
├── core/           # Entidades base, Either, eventos, erros
├── domain/         # Regras de negócio (use cases, entities, subscribers)
├── infra/          # HTTP, Prisma, Redis, R2, auth, env
└── test/           # Factories e repositórios in-memory
```

A documentação OpenAPI (Scalar) fica apenas na camada `infra/http`, sem poluir o domínio.

## Docker

```bash
npm run docker:up       # Sobe Postgres + Redis
npm run docker:down     # Para os containers
npm run docker:logs     # Logs dos serviços
npm run docker:exec     # psql no Postgres
```

## Licença

[MIT](LICENSE)
