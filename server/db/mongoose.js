const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://praveen_r08:United25@ds255347.mlab.com:55347/todoApp');
mongodb://<dbuser>:<dbpassword>@ds255347.mlab.com:55347/todo
mongoose.exports = {
    mongoose
};
