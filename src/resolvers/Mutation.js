import { v4 as uuidv4 } from 'uuid';

const Mutation = {
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
    createPost(parent, args, {db, pubsub}) {
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
        pubsub.publish('post', {
            post : {
                mutation: 'CREATED',
                data: post
            }
        })

        return post;
    },
    createComment(parent, args, {db, pubsub}) {
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
        pubsub.publish(`comment ${args.data.post}`, {comment})

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
    deletePost(parent, args, {db, pubsub}){
        // remove user
        const index = db.allPosts.findIndex((post) => post.id === args.id)
        if(index === -1){
            throw new Error('Post not found')
        }

        // remove post
        const [post] = db.allPosts.splice(index, 1)

        // remove all comments related to the user
        db.allComments = db.allComments.filter((comment) => comment.post !== args.id)

        pubsub.publish('post', {
            post : {
                mutation: 'DELETED',
                data: post
            }
        })

        return post
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
    },
    updateUser(parent, args, {db}) {
        const user = db.allUsers.find((user) => { return user.id === args.id})

        if(!user) {
            throw new Error('User does not exist')
        }

        // update user name
        if(typeof args.data.name === 'string') {
            user.name = args.data.name
        }

        // update user email
        if(typeof args.data.email === 'string') {
            const emailTaken = db.allUsers.some((user) => { return user.email === args.data.email})
            
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
    updatePost(parent, args, {db, pubsub}) {
        const post = db.allPosts.find((post) => { return post.id === args.id})

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

        // trigger subscription 
        pubsub.publish('post', {
            post : {
                mutation: 'UPDATED',
                data: post
            }
        })

        return post;
    },
    updateComment(parent, args, {db}) {
        const comment = db.allComments.find((comment) => { return comment.id === args.id})

        if(!comment) {
            throw new Error('Comment does not exist')
        }

        // update comment text
        if(typeof args.data.text === 'string') {
            comment.text = args.data.text
        }

        return comment;
    }
}

export default Mutation