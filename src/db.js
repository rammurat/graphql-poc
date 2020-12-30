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

const db = {allUsers, allPosts, allComments}

export default db