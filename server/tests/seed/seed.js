const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const JWT_Secret = process.env.JWT_SECRET;

const users = [{
    _id: userOneId,
    email: 'testuser@test.com',
    password: 'asdf1234',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, JWT_Secret).toString()
    }]
}, {
    _id: userTwoId,
    email: 'testuser2@test.com',
    password: 'qwer1234',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, JWT_Secret).toString()
    }]
}]

const todos = [{
    _id: new ObjectId(),
    text: 'Light the candles',
    completed: true,
    completedAt: 333,
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'Mow the lawn',
    completed: false,
    completedAt: null,
    _creator: userTwoId
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