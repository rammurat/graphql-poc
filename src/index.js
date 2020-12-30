import {GraphQLServer} from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';
import db from './db'

// resolvers
const resolvers = {
    Query: {
        allPosts(parent, args, {db}) {
            return db.allPosts
        },
        allUsers(parent, args, {db}) {
            return db.allUsers
        },
        allComments(parent, args, {db}) {
            return db.allComments
        },
        posts(parent, args, {db}) {
            if(!args.query) {
                return db.allPosts
            }

            return db.allPosts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        users(parent, args, {db}) {
            if(!args.query) {
               return db.allUsers
            }

            return db.allUsers.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    Mutation: {
        createUser(parent, args, {db}) {
            const isUserExist = db.allUsers.some((user) => { return user.email === args.data.email})

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

            db.allUsers.push(user)
            return user;
        },
        createPost(parent, args, {db}) {
            const isUserExist = db.allUsers.some((user) => { return user.id === args.data.author})
            
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

            db.allPosts.push(post)
            return post;
        },
        createComment(parent, args, {db}) {
            const isUserExist = db.allUsers.find((user) => { return user.id === args.data.author})
            const isPostExist = db.allPosts.find((post) => { return post.id === args.data.post})

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

            db.allComments.push(comment)
            return comment;
        },
        deleteUser(parent, args, {db}){
            // remove user
            const index = db.allUsers.findIndex((user) => user.id === args.id)
            if(index === -1){
                throw new Error('User not found')
            }
            const newUsers = db.allUsers.splice(index, 1)

            // remove all posts related to the user
            db.allPosts = db.allPosts.filter((post) => {
                const match = (post.author === args.id)

                if(match) {
                    // remove all comments related to the user
                    db.allComments = db.allComments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            db.allComments = db.allComments.filter((comment) => comment.author !== args.id)

            return newUsers[0]
        },
        deletePost(parent, args, {db}){
            // remove user
            const index = db.allPosts.findIndex((post) => post.id === args.id)
            if(index === -1){
                throw new Error('Post not found')
            }

            // remove post
            const newPosts = db.allPosts.splice(index, 1)

            // remove all comments related to the user
            db.allComments = db.allComments.filter((comment) => comment.post !== args.id)
 
            return newPosts[0]
        },
        deleteComment(parent, args, {db}){
            // remove user
            const index = db.allComments.findIndex((comment) => comment.id === args.id)
            if(index === -1){
                throw new Error('Comment not found')
            }

            // remove post
            const newComments = db.allComments.splice(index, 1) 
            return newComments[0]
        }
    },
    Post: {
        author(parent, args, {db}) {
            return db.allUsers.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, {db}) {
            return db.allComments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        articles(parent, args, {db}) {
            return db.allPosts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, {db}) {
            return db.allComments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, {db}) {
            return db.allUsers.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, {db}) {
            return db.allPosts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log("Server running")
})