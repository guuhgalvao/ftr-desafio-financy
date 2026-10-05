# Financy — backend

API GraphQL do Financy: Express 5, Apollo Server 5, type-graphql, Prisma e SQLite.

## Requisitos

- Node 24.16.0 (ver `.nvmrc` na raiz)
- pnpm

## Como rodar

```bash
pnpm install
```

Crie o arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Preencha o `JWT_SECRET` com qualquer texto longo e aleatório:

```
JWT_SECRET=troque-por-um-segredo-longo
DATABASE_URL="file:./dev.db"
```

Sem `JWT_SECRET` a API não sobe e avisa qual variável está faltando.

```bash
pnpm db:migrate   # cria prisma/dev.db, aplica as migrations e gera o Prisma Client
pnpm db:seed      # recria o usuário demo com categorias e transações
pnpm dev          # http://localhost:4000/graphql
```

Na primeira vez, o `db:migrate` já executa o seed ao criar o banco. O `db:seed` pode ser repetido à vontade: ele apaga e recria só os dados do usuário demo.

## Usuário demo

| E-mail | Senha |
|---|---|
| `demo@financy.dev` | `financy123` |

## Apollo Sandbox

Com a API no ar, abra http://localhost:4000/graphql no navegador para explorar o schema e testar as operações.

Para as operações protegidas, rode o `login` com o usuário demo e cole o `token` na aba **Headers**:

```graphql
mutation {
  login(data: { email: "demo@financy.dev", password: "financy123" }) {
    token
  }
}
```

```
Authorization: Bearer <token>
```

## Scripts

| Script | O que faz |
|---|---|
| `pnpm dev` | Sobe a API com recarga automática |
| `pnpm start` | Sobe a API sem recarga |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | Biome (checar / corrigir) |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:migrate` | Aplica as migrations em desenvolvimento |
| `pnpm db:seed` | Popula o banco com o usuário demo |
| `pnpm db:reset` | Apaga o banco e reaplica as migrations e o seed |

Não há etapa de build: a API roda com `tsx` tanto no `dev` quanto no `start`.

## Autenticação

`register` e `login` são públicas e devolvem um `token` (JWT, 7 dias). As demais operações exigem o header:

```
Authorization: Bearer <token>
```

O schema emitido fica em `schema.graphql` e é atualizado sempre que a API sobe.
