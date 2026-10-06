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

Preencha também as chaves `CLOUDFLARE_*` (ver [Avatar (Cloudflare R2)](#avatar-cloudflare-r2)). Sem alguma das variáveis a API não sobe e avisa qual está faltando.

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

## Avatar (Cloudflare R2)

A foto de perfil fica num bucket do Cloudflare R2. O arquivo vai do navegador direto para o bucket, por uma URL de `PUT` assinada pela API (válida por 5 minutos, com tipo e tamanho assinados). A API nunca recebe o arquivo e as credenciais nunca chegam ao front.

1. `createAvatarUploadUrl(contentType, contentLength)` devolve `uploadUrl` e `key`. Aceita `image/png`, `image/jpeg` e `image/webp`, até 2 MB.
2. O front faz o `PUT` do arquivo em `uploadUrl`.
3. `updateAvatar(key)` confere que a chave é do usuário e que o objeto existe, grava `User.avatarUrl` e apaga a foto anterior do bucket.
4. `removeAvatar` apaga o objeto e zera `avatarUrl`.

`updateAvatar` e `removeAvatar` também limpam o prefixo do usuário: além da foto anterior, apagam envios que nunca foram confirmados (com mais de 6 minutos) e objetos cuja exclusão falhou antes. O `pnpm db:seed` mantém o `id` e a foto do usuário demo; já o `pnpm db:reset` apaga o banco e deixa as fotos no bucket.

### Configuração do R2

1. Crie um bucket (ex.: `financy-uploads`) e ative o acesso público pelo subdomínio `r2.dev` (Settings → Public Development URL).
2. Crie um token de API do R2 com permissão **Object Read & Write** restrita a esse bucket.
3. Em Settings → CORS Policy do bucket, libere o envio a partir do front:

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedHeaders": ["Content-Type"]
  }
]
```

4. Preencha o `.env`:

| Variável | Valor |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta (aparece no endpoint S3 do bucket) |
| `CLOUDFLARE_ACCESS_KEY_ID` | Access Key ID do token |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Secret Access Key do token |
| `CLOUDFLARE_BUCKET` | Nome do bucket |
| `CLOUDFLARE_PUBLIC_URL` | URL pública do bucket, com `https://` (ex.: `https://pub-xxxx.r2.dev`) |

Os objetos são gravados em `avatars/{userId}/{uuid}.{ext}`.
