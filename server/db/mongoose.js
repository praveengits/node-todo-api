const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

mongoose.exports = {
    mongoose
};

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// // var newTodo = new Todo({
// //     text: 'Walk the dog',
// //     completed: true,
// //     completedAt: 10 
// // });

// // newTodo.save().then((result) => {
// //     console.log(`Save success ___ ${JSON.stringify(result, undefined, 2)}`);
// // }, (err) => {
// //     console.log(`Unable to save ___ ${err}`);    
// // });

// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     }
// });

// var newUser = new User({
//     email : 'test@test.com'
// });

// newUser.save().then((result) => {
//     console.log(`Save success ___ ${JSON.stringify(result, undefined, 2)}`);
// }, (err) => {
//     console.log(`Unable to save ___ ${err}`);    
// });