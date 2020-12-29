import {GraphQLServer} from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';

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
        posts(query: String): [Post!]!,
        users(query: String): [User!]!,
        allUsers: [User!]!,
        allPosts: [Post!]!,
        allComments: [Comment!]!
    }

    type Mutation {
        createUser(data: AddUserInput) : User!
        createPost(data: AddPostInput) : Post!
        createComment(data: AddCommentInput) : Comment!
    }

    input AddUserInput {
        name: String!, 
        email: String!, 
        age: Int!
    }

    input AddPostInput {
        title: String!, 
        body: String!, 
        published: Boolean!,
        author: ID!
    }

    input AddCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
    }

    type Post {
        id: ID!,
        title: String!,
        body: String!,
        published: Boolean!,
        author: User!,
        comments: [Comment!]!
    }

    type User {
        id: ID!,
        name: String!,
        email: String!,
        age: Int!,
        articles: [Post!]!,
        comments: [Comment!]!
    }

    type Comment {
        id: ID!,
        text: String!,
        author: User!,
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
    Mutation: {
        createUser(parent, args) {
            const isUserExist = allUsers.some((user) => { return user.email === args.data.email})

            if(isUserExist) {
                throw new Error('User already exist')
            }

            // add new user and return 
            const user = {
                id: uuidv4(),
                name: args.data.name,
                email: args.data.email,
                age: args.data.age
            }

            allUsers.push(user)
            return user;
        },
        createPost(parent, args) {
            const isUserExist = allUsers.some((user) => { return user.id === args.data.author})
            
            if(!isUserExist) {
                throw new Error('User does not exist')
            }

            // add new user and return 
            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: args.data.author
            }

            allPosts.push(post)
            return post;
        },
        createComment(parent, args) {
            const isUserExist = allUsers.find((user) => { return user.id === args.data.author})
            const isPostExist = allPosts.find((post) => { return post.id === args.data.post})

            if(!isUserExist || !isPostExist) {
                throw new Error("Can't find user or post.")
            }

            // add new user and return 
            const comment = {
                id: uuidv4(),
                text: args.data.text,
                author: args.data.author,
                post: args.data.post
            }

            allComments.push(comment)
            return comment;
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