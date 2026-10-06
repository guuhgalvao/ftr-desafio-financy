# ftr-desafio-financy

Financy é um gerenciador de finanças pessoais: cada usuário cria sua conta e organiza suas transações (entradas e saídas) em categorias, com um dashboard de saldo, receitas e despesas do mês.

O repositório tem dois projetos independentes, uma API GraphQL e uma SPA em React.

## Stack

| Pacote | Tecnologias |
|---|---|
| [`backend/`](backend/README.md) | TypeScript, Express 5, Apollo Server 5, type-graphql, Prisma 6, SQLite, JWT, Zod, Cloudflare R2 (AWS SDK v3) |
| [`frontend/`](frontend/README.md) | TypeScript, React 19, Vite, Apollo Client 4, GraphQL Code Generator, React Router 7, Tailwind CSS 4, shadcn/ui, React Hook Form, Zod |

## Estrutura

```
backend/    API GraphQL (porta 4000)
  prisma/   schema, migrations e seed
  src/      resolvers, services, models e inputs
frontend/   SPA (porta 5173)
  src/      páginas, componentes, documentos GraphQL e tipos gerados
```

Cada pasta tem seu próprio `package.json`, `.env.example` e README com mais detalhes. Não há workspace na raiz: os comandos são sempre executados dentro de `backend/` ou de `frontend/`.

## Requisitos

- Node 24.16.0 (o `.nvmrc` da raiz tem a versão)
- pnpm

## Como rodar

São dois terminais: um para a API e outro para o front.

### 1. Clonar

```bash
git clone https://github.com/guuhgalvao/ftr-desafio-financy.git
cd ftr-desafio-financy
```

### 2. Back-end

```bash
cd backend
pnpm install
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Abra o `backend/.env` e preencha o `JWT_SECRET` com qualquer texto longo e aleatório:

```
JWT_SECRET=troque-por-um-segredo-longo
DATABASE_URL="file:./dev.db"
```

Esta branch (`feat/avatar-upload`) guarda a foto de perfil no Cloudflare R2: preencha também as chaves `CLOUDFLARE_*`, seguindo a seção [Avatar (Cloudflare R2)](backend/README.md#avatar-cloudflare-r2) do README do back-end. Sem elas a API não sobe.

Crie o banco, popule o usuário demo e suba a API:

```bash
pnpm db:migrate   # cria prisma/dev.db e aplica as migrations
pnpm db:seed      # recria o usuário demo com categorias e transações
pnpm dev          # http://localhost:4000/graphql
```

### 3. Front-end

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
pnpm install
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Abra o `frontend/.env` e aponte para a API:

```
VITE_BACKEND_URL=http://localhost:4000
```

```bash
pnpm dev          # http://localhost:5173
```

### 4. Entrar

Abra http://localhost:5173 e faça login com o usuário demo:

| E-mail | Senha |
|---|---|
| `demo@financy.dev` | `financy123` |

Também dá para criar uma conta nova em "Criar conta". Cada usuário vê apenas as próprias transações e categorias.

## Verificações

| Pacote | Comandos |
|---|---|
| `backend/` | `pnpm typecheck`, `pnpm lint` |
| `frontend/` | `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm codegen` |

O back-end não tem etapa de build: roda com `tsx`. No front-end, o `pnpm codegen` gera os tipos em `src/gql/` a partir de `backend/schema.graphql`.
