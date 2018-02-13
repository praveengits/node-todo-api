const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose'); // mention path if not installed npm
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {    
    console.log(req.body);    
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    todo.save().then((doc) => {
        console.log(`saved Data: \n 
                    ${JSON.stringify(doc, undefined, 2)}`);
        res.status(200)
            .send(doc);
    }, (err) => {
        console.log(`Unable to save todo ! ${err}`);
        res.status(400)
            .send(err);
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});