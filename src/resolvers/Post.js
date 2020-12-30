const Post = {
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
}

export default Post