const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose'); // mention path if not installed npm
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

module.exports = {
    app
}