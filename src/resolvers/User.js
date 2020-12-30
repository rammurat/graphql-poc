const User = {
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
}

export default User