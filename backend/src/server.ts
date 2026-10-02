import 'reflect-metadata'
import './env'
import path from 'node:path'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { authChecker } from './graphql/auth-checker'
import { buildContext, type Context } from './graphql/context'
import { formatError } from './graphql/format-error'
import { UserResolver } from './resolvers/user.resolver'

const PORT = 4000

const schema = await buildSchema({
  resolvers: [UserResolver],
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

app.listen(PORT, () => {
  console.log(`API em http://localhost:${PORT}/graphql`)
})
