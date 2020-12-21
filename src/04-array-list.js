import {GraphQLServer} from 'graphql-yoga'
const posts = [{
    id: 11,
    title: 'Ram',
    body: 'First post',
    published: true
}, {
    id: 12,
    title: 'Deepak',
    body: 'Second post',
    published: true
}]

// type defination
const typeDefs = `
    type Query {
        hello: String!,
        weather: String!,
        post: Post,
        posts: [Post!]!
        greeting(name: String, salary: Int): String!
    }

    type Post {
        id: ID!,
        title: String!,
        body: String!,
        published: Boolean!
    }
`

// resolvers
const resolvers = {
    Query: {
        posts() {
            return posts
        },
        hello() {
            return 'Hello world!'
        },
        weather() {
            return '15 Degrees'
        },
        post() {
            return {
                id: 11,
                title: 'Ram',
                body: 'This is a first post',
                published: true
            }
        },
        greeting(parent, args) {
            return `Hello ${args.name}, your salary is ${args.salary}.`
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
