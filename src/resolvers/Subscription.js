const Subscription = {
    comment: {
        subscribe(parent, {postId}, {db, pubsub}, info)   {
            const post = db.allPosts.find((post) => post.id === postId)

            if(!post) {
                throw Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, {postId}, {pubsub}, info)   {
            return pubsub.asyncIterator('post')
        }
    }
}

export default Subscription