const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(result);    
// });

// Todo.findOneAndRemove({}).then((todo) => {
//     console.log(todo);    
// });

// Todo.findByIdAndRemove(id).then((todo) => {
//     console.log(todo);    
// });