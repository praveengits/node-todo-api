const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a83236cd2403740bcf4befe';
// if(!ObjectId.isValid(id)){
//     console.log('Invalid id ', id);    
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log(todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log(todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//        return console.log('No data for that id');
//     }
//     console.log(todo);
// }).catch((e) => console.log(e));

User.findById(id).then((user) => {
    if(!user){
       return console.log('No user for that id');
    }
    console.log(user);
}).catch((e) => console.log(e));