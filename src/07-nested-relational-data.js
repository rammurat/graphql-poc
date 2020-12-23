import {GraphQLServer} from 'graphql-yoga'

const allUsers = [{
    id: "1",
    name: 'Ram',
    email: 'rammurat@gmail.com',
    age: "32"
}, {
    id: "2",
    name: 'Deepak',
    email: 'deepak@gmail.com',
    age: "29"
}]

const allPosts = [{
    id: "11",
    title: 'Post 1',
    body: 'First post',
    published: true,
    author: "1"
}, {
    id: "12",
    title: 'Post 2',
    body: 'Second post',
    published: true,
    author: "2"
},{
    id: "13",
    title: 'Post 3',
    body: 'Third post',
    published: false,
    author: "1"
}, {
    id: "14",
    title: 'Post 4',
    body: 'Forth post',
    published: false,
    author: "2"
}]

const allComments = [{
    id: "101",
    text: "This is comment 1",
    author: "1",
    post: "11"
}, {
    id: "102",
    text: "This is comment 2",
    author: "2",
    post: "12"
}, {
    id: "103",
    text: "This is comment 3",
    author: "1",
    post: "13"
}, {
    id: "104",
    text: "This is comment 4",
    author: "2",
    post: "14"
},{
    id: "105",
    text: "This is comment 5",
    author: "1",
    post: "11"
},{
    id: "106",
    text: "This is comment 6",
    author: "2",
    post: "12"
}]

// type defination
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        allUsers: [User!]!
        allPosts: [Post!]!
        allComments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int!
        articles: [Post!]!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// resolvers
const resolvers = {
    Query: {
        allPosts() {
            return allPosts
        },
        allUsers() {
            return allUsers
        },
        allComments() {
            return allComments
        },
        posts(parent, args) {
            if(!args.query) {
                return allPosts
            }

            return allPosts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        users(parent, args) {
            if(!args.query) {
               return allUsers
            }

            return allUsers.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    Post: {
        author(parent, args) {
            return allUsers.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args) {
            return allComments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        articles(parent, args) {
            return allPosts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args) {
            return allComments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args) {
            return allUsers.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args) {
            return allPosts.find((post) => {
                return post.id === parent.post
            })
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