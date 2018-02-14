const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'testuser@test.com',
    password: 'asdf1234',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: new ObjectId(),
    email: 'testuser2@test.com',
    password: 'qwer1234',
    tokens: []
}]

const todos = [{
    _id: new ObjectId(),
    text: 'Light the candles',
    completed: true,
    completedAt: 333
}, {
    _id: new ObjectId(),
    text: 'Mow the lawn',
    completed: false,
    completedAt: null
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
    
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}