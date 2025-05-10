const {ApolloServer} = require('@apollo/server')
const {startStandaloneServer} = require('@apollo/server/standalone')
const {v1: uuid} = require('uuid')
const mongoose = require('mongoose')
const {GraphQLError} = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

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

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  
  
    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
    }
  
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    
   createUser(
    username: String!
    favoriteGenre: String!
  ): User
  
  login(
    username: String!
    password: String!
  ): Token
}

        
`

const resolvers = {
    Query: {
        bookCount: async () => await Book.countDocuments(),
        authorCount: async () => await Author.countDocuments(),
        allAuthors: async () => await Author.find({}),
        allBooks: async (root, args) => {
            let filter = {}
            if (args.author) {
                const author = await Author.findOne({name: args.author})
                if (!author)
                    throw new GraphQLError("Author not found", {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author
                        }
                    })

                filter.author = author._id
            }
            if (args.genre) {
                filter.genres = args.genre
            }
            return Book.find(filter).populate('author')
        },
        me: (root, args, context) => {
            return context.currentUser
        }


    },
    Author: {
        // bookCount: (root) => books.filter(book => book.author === root.name).length,
    },
    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser)
                throw new GraphQLError("Not authenticated", {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                })

            let author = await Author.findOne({name: args.author});
            if (!author) {
                try {
                    author = new Author({name: args.author})
                    await author.save();
                } catch (error) {
                    throw new GraphQLError("Bad author name", {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }
            }

            try {
                const book = new Book({...args, author})
                await book.save()
                return book
            } catch (error) {
                throw new GraphQLError("Bad book name", {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error
                    }
                })
            }
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser)
                throw new GraphQLError("Not authenticated", {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                })

            try {
                return await Author.findOneAndUpdate({name: args.name}, {born: args.setBornTo}, {new: true});
            } catch (error) {
                throw new GraphQLError("Author doesn't exist", {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        login: async (root, args) => {
            const user = await User.findOne({username: args.username})
            if (!user || args.password !== 'secret') {
                throw new GraphQLError("Wrong credentials", {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id
            }
            return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
        },
        createUser: async (root, args) => {
            const user = new User({username: args.username, favoriteGenre: args.favoriteGenre})
            try {
                await user.save()
            } catch (error) {
                throw new GraphQLError("Username already exists", {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.username,
                        error
                    }
                })
            }
            return user
        }
    }
}

const server = new ApolloServer({
    typeDefs, resolvers,
})

startStandaloneServer(server, {
    listen: {port: 4000},
    context: async ({req}) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return {currentUser}
        }
    }
}).then(({url}) => {
    console.log(`Server ready at ${url}`)
})
