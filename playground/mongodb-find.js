// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if (err) {
        return console.log('unable to connect to Mongo DB');        
    } 
    console.log('Connected to MongoDB server!');    

    // db.collection('Todos').find({_id: new ObjectID('5a831004d4882d1f0ae57fa4')}).toArray().then(
    //     (docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));                
    //     },
    //     (err) => {
    //         console.log('Unable to fetch docs!', err);            
    //     }
    // );

    db.collection('Todos').find().count().then(
        (count) => {
            console.log(`Total count : ${count}`);                
        },
        (err) => {
            console.log('Unable to fetch docs!', err);            
        }
    );

    // db.close();
});
