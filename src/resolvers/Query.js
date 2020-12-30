const Query = {
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
}

export default Query