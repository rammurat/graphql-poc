
const Comment = {
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

export default Comment