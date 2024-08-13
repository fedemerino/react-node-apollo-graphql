import express from "express"
import cors from "cors"
import { logger } from "./config/logger.js"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServer } from "@apollo/server"
import { typeDefs } from "./graphql/typeDefs/typeDefs.js"
import { resolvers } from "./graphql/resolvers/resolvers.js"
import { createServer } from "http"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"

const app = express()
const PORT = 3000
const schema = makeExecutableSchema({ typeDefs, resolvers })
const httpServer = createServer(app)
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
})
const serverCleanup = useServer({ schema }, wsServer)

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      logger.error(error)
      return {
        message: error.message,
        code: error.extensions.code,
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  await server.start()
  app.use("/graphql", expressMiddleware(server))
  app.use("/", (req, res) => {
    res.send("Hello World")
  })
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
    console.log(`GraphQL is running on port http://localhost:${PORT}/graphql`)
    console.log(`Websocket is running on port ws://localhost:${PORT}/graphql`)
  })
}

startServer()
