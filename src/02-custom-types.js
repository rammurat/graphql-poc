import {GraphQLServer} from 'graphql-yoga'

// type defination
const typeDefs = `
    type Query {
        hello: String!,
        weather: String!,
        me: User
    }

    type User {
        id: ID!,
        name: String!,
        age: Int
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
        },
        me() {
            return {
                id: 11,
                name: 'Ram'
            }
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
