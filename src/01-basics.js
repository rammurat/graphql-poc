import {GraphQLServer} from 'graphql-yoga'

// type defination
const typeDefs = `
    type Query {
        hello: String!,
        weather: String!
    }
`

// resolvers
const resolvers = {
    Query: {
        hello() {
            return 'Hello world!'
        },
        weather() {
            return '15 Degrees'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log("Server running")
})
