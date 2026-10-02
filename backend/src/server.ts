import 'reflect-metadata'
import './env'
import path from 'node:path'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { buildSchema } from 'type-graphql'
import { authChecker } from './graphql/auth-checker'
import { buildContext, type Context } from './graphql/context'
import { formatError } from './graphql/format-error'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'
import { UserResolver } from './resolvers/user.resolver'

const PORT = 4000

const schema = await buildSchema({
  resolvers: [UserResolver, CategoryResolver, TransactionResolver],
  authChecker,
  validate: false,
  emitSchemaFile: path.resolve(import.meta.dirname, '../schema.graphql'),
})

const server = new ApolloServer<Context>({
  schema,
  formatError,
  includeStacktraceInErrorResponses: false,
})
await server.start()

const app = express()

app.use(
  '/graphql',
  cors({ origin: true }),
  express.json(),
  expressMiddleware(server, { context: buildContext }),
)

// Errors raised before Apollo runs (e.g. malformed JSON body) would otherwise hit Express's
// default handler, which answers with an HTML stack trace.
const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error)

  const isBadRequest = error?.type === 'entity.parse.failed' || error?.status === 400
  if (!isBadRequest) console.error(error)

  res.status(isBadRequest ? 400 : 500).json({
    errors: [
      isBadRequest
        ? { message: 'Requisição inválida.', extensions: { code: 'BAD_REQUEST' } }
        : {
            message: 'Erro interno. Tente novamente.',
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          },
    ],
  })
}
app.use(errorHandler)

// Express 5 hands listen errors (e.g. port already in use) to this callback.
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Não foi possível subir a API na porta ${PORT}: ${error.message}`)
    process.exit(1)
  }
  console.log(`API em http://localhost:${PORT}/graphql`)
})
