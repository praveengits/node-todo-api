// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if (err) {
        return console.log('unable to connect to Mongo DB');        
    } 
    console.log('Connected to MongoDB server!');    
    // "text" : "Wash clothes",
    // "completed" : false
    // delete Many
    // db.collection('Todos').deleteMany({'text':'Wash clothes'})
    // .then((result) => {
    //     console.log(result);        
    // });

    // delete One
    // db.collection('Todos').deleteOne({'text':'Wash clothes'})
    // .then((result) => {
    //     console.log(result);        
    // });

    // find one and delete

    db.collection('Todos').findOneAndDelete({'text':'Wash clothes'})
    .then((result) => {
        console.log(result);        
    });

    // db.close();
});
