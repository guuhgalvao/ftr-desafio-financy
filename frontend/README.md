# Financy — frontend

SPA em React + Vite + TypeScript que consome a API GraphQL de `../backend`.

Stack: React 19, Vite, Tailwind CSS 4, shadcn/ui (Radix), Apollo Client 4, GraphQL Code Generator, React Router 7, Zustand, React Hook Form e Zod.

## Requisitos

- Node 24.16 (ver `../.nvmrc`)
- pnpm 11
- A API rodando (ver `../backend/README.md`)

## Como rodar

```bash
pnpm install
```

Crie o `.env` a partir do exemplo e aponte para a API:

```bash
cp .env.example .env
```

```
VITE_BACKEND_URL=http://localhost:4000
```

```bash
pnpm dev
```

A aplicação abre em `http://localhost:5173`.

## Scripts

| Script | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Typecheck e build de produção em `dist/` |
| `pnpm preview` | Serve o build de produção |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | Biome (checagem / correção) |
| `pnpm codegen` | Gera os tipos e documentos GraphQL em `src/gql/` |

## GraphQL

Os tipos de `src/gql/` são gerados a partir de `../backend/schema.graphql` e ficam versionados, então o build não depende da API no ar. Rode `pnpm codegen` sempre que o schema ou algum documento `graphql(...)` mudar.

## Style guide

Em desenvolvimento, `http://localhost:5173/_styleguide` mostra todos os componentes do design e seus estados. A rota não entra no build de produção.

## Estrutura

- `src/components/` — componentes do design; `src/components/ui/` — primitivos do shadcn.
- `src/pages/` — uma pasta por página.
- `src/lib/` — Apollo Client, formatação de moeda e data, categorias.
- `src/stores/` — sessão (token e usuário).
- `src/gql/` — código gerado pelo codegen.
