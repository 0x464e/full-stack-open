const Book = require("../mongoose/book-schema");
const Author = require("../mongoose/author-schema");
const {GraphQLError} = require("graphql/index");
const User = require("../mongoose/user-schema");
const jwt = require("jsonwebtoken");
const {PubSub} = require('graphql-subscriptions')
const pubsub = new PubSub()


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
        bookCount: async (root) => {
            const books = await Book.find({author: root._id})
            return books.length
        }
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

                pubsub.publish('BOOK_ADDED', {bookAdded: book})

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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

module.exports = resolvers
