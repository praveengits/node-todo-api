require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _= require('lodash');

var {mongoose} = require('./db/mongoose'); // mention path if not installed npm
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {    
    //console.log(req.body);    
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.status(200)
            .send(doc);
    }, (err) => {
        res.status(400)
            .send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {    

    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.status(200).send({todos});
    },(err) => {
        res.status(400)
        .send(err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {    
    //console.log(req.body);   
    if(!req.params.id || !ObjectId.isValid(req.params.id)){
        res.status(404).send({});
    }
    Todo.findOne({
        _id: req.params.id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400)
        .send(err);
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    if(!req.params.id || !ObjectId.isValid(req.params.id)){
        res.status(404).send({});
    }
    Todo.findOneAndRemove({
        _id: req.params.id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400)
        .send(err);
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!id || !ObjectId.isValid(id)){
        res.status(404).send({});
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: req.params.id,
        _creator: req.user._id
    }, {$set: body},{new: true})
        .then((todo) => {
            if(!todo){
                res.status(404).send({});
            }
            res.status(200).send({todo});
        })
        .catch(() => {
            res.status(400)
            .send(err);
        });

});

app.post('/users', (req, res) => {    
    var body = _.pick(req.body, ['email', 'password']);
    //console.log(req.body);    
    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then(() => {
       return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token)
        .status(200)
        .send(user);
    }).catch((err) => {
        res.status(400)
            .send(err);
    });
});


app.post('/users/login', (req, res) => {    
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
    .then((user) => {
        return user.generateAuthToken()
        .then((token) => {
            res.header('x-auth', token)
            .status(200)
            .send(user);
        })
    }).catch((err) => {
        res.status(400)
            .send(err);
    });
});

app.delete('/users/me/',authenticate, (req, res) => {       
    req.user.removeToken(req.headers['x-auth'])
        .then(() => {
            res.header('x-auth',null).status(200).send();
        },(err) => {
            res.status(400).send();
        })
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

module.exports = {
    app
}