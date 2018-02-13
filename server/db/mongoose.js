const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://testuser:testuser123@ds235418.mlab.com:35418/todoapp');
//mongodb://<dbuser>:<dbpassword>@ds255347.mlab.com:55347/todo
mongoose.exports = {
    mongoose
};
