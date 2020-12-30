import {GraphQLServer} from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';

let allUsers
let allPosts
let allComments

allUsers = [{
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

allPosts = [{
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

allComments = [{
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

        deleteUser(id: ID!) : User!
        deletePost(id: ID!) : Post!
        deleteComment(id: ID!) : Comment!

        updateUser(id: ID!, data: UpdateUserInput) : User!
        updatePost(id: ID!, data: UpdatePostInput) : Post!
        updateComment(id: ID!, data: UpdateCommentInput) : Comment!
    }

    input AddUserInput {
        name: String!, 
        email: String!, 
        age: Int!
    }

    input UpdateUserInput {
        name: String, 
        email: String, 
        age: Int
    }

    input AddPostInput {
        title: String!, 
        body: String!, 
        published: Boolean!,
        author: ID!
    }

    input UpdatePostInput {
        title: String, 
        body: String, 
        published: Boolean,
        author: ID
    }

    input AddCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
    }

    input UpdateCommentInput {
        text: String, 
        author: ID, 
        post: ID
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
        updateUser(parent, args) {
            const user = allUsers.find((user) => { return user.id === args.id})

            if(!user) {
                throw new Error('User does not exist')
            }

            // update user name
            if(typeof args.data.name === 'string') {
                user.name = args.data.name
            }

            // update user email
            if(typeof args.data.email === 'string') {
                const emailTaken = allUsers.some((user) => { return user.email === args.data.email})
                
                if(emailTaken) {
                    throw new Error('Email taken')
                }

                user.email = args.data.email
            }

            // update user age
            if(typeof args.data.age !== 'undefined') {
                user.age = args.data.age
            }

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
        updatePost(parent, args) {
            const post = allPosts.find((post) => { return post.id === args.id})

            if(!post) {
                throw new Error('Post does not exist')
            }

            // update post title
            if(typeof args.data.title === 'string') {
                post.title = args.data.title
            }

            // update post body
            if(typeof args.data.body === 'string') {
                post.body = args.data.body
            }

            // update post published state
            if(typeof args.data.published === 'boolean') {
                post.published = args.data.published
            }

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
        },
        updateComment(parent, args) {
            const comment = allComments.find((comment) => { return comment.id === args.id})

            if(!comment) {
                throw new Error('Comment does not exist')
            }

            // update comment text
            if(typeof args.data.text === 'string') {
                comment.text = args.data.text
            }

            return comment;
        },
        deleteUser(parent, args){
            // remove user
            const index = allUsers.findIndex((user) => user.id === args.id)
            if(index === -1){
                throw new Error('User not found')
            }
            const newUsers = allUsers.splice(index, 1)

            // remove all posts related to the user
            allPosts = allPosts.filter((post) => {
                const match = (post.author === args.id)

                if(match) {
                    // remove all comments related to the user
                    allComments = allComments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            allComments = allComments.filter((comment) => comment.author !== args.id)

            return newUsers[0]
        },
        deletePost(parent, args){
            // remove user
            const index = allPosts.findIndex((post) => post.id === args.id)
            if(index === -1){
                throw new Error('Post not found')
            }

            // remove post
            const newPosts = allPosts.splice(index, 1)

            // remove all comments related to the user
            allComments = allComments.filter((comment) => comment.post !== args.id)
 
            return newPosts[0]
        },
        deleteComment(parent, args){
            // remove user
            const index = allComments.findIndex((comment) => comment.id === args.id)
            if(index === -1){
                throw new Error('Comment not found')
            }

            // remove post
            const newComments = allComments.splice(index, 1) 
            return newComments[0]
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