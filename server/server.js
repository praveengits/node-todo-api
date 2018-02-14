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

app.post('/todos', (req, res) => {    
    //console.log(req.body);    
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    todo.save().then((doc) => {
        //console.log(`saved Data: \n 
                    //${JSON.stringify(doc, undefined, 2)}`);
        res.status(200)
            .send(doc);
    }, (err) => {
        //console.log(`Unable to save todo ! ${err}`);
        res.status(400)
            .send(err);
    });
});

app.get('/todos', (req, res) => {    
    //console.log(req.body);    
    Todo.find().then((todos) => {
        res.status(200).send({todos});
    },(err) => {
        res.status(400)
        .send(err);
    });
});

app.get('/todos/:id', (req, res) => {    
    //console.log(req.body);   
    if(!req.params.id || !ObjectId.isValid(req.params.id)){
        res.status(404).send({});
    }
    Todo.findById(req.params.id).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400)
        .send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    if(!req.params.id || !ObjectId.isValid(req.params.id)){
        res.status(404).send({});
    }
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if(!todo){
            res.status(404).send({});
        }
        res.status(200).send({todo});
    }).catch((err) => {
        res.status(400)
        .send(err);
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findOneAndUpdate(id, {$set: body},{new: true})
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