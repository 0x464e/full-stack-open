const {ApolloServer} = require('@apollo/server')
const {v1: uuid} = require('uuid')
const mongoose = require('mongoose')
const {GraphQLError} = require('graphql')
const jwt = require('jsonwebtoken')
const {expressMiddleware} = require('@apollo/server/express4')
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer')
const {makeExecutableSchema} = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const {WebSocketServer} = require('ws')
const {useServer} = require('graphql-ws/lib/use/ws')

require('dotenv').config()

const typeDefs = require('./apollo/schema')
const resolvers = require('./apollo/resolvers')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false);
const Book = require('./mongoose/book-schema');
const Author = require('./mongoose/author-schema');
const User = require('./mongoose/user-schema');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    })

    const schema = makeExecutableSchema({typeDefs, resolvers})
    const serverCleanup = useServer({schema}, wsServer)

    const server = new ApolloServer({
        schema: schema,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },],
    })

    await server.start()

    app.use(cors())
    app.use(express.json())
    app.use(
        '/',
        expressMiddleware(server, {
            context: async ({req}) => {
                const auth = req ? req.headers.authorization : null
                if (auth && auth.startsWith('Bearer ')) {
                    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
                    const currentUser = await User.findById(decodedToken.id);
                    return {currentUser}
                }
            },
        }),
    )

    const PORT = 4000

    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}`)
    )
}

start()
