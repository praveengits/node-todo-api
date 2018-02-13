// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if (err) {
        return console.log('unable to connect to Mongo DB');        
    } 
    console.log('Connected to MongoDB server!');    

    // db.collection('Todos').insertOne({
    //     test: 'Some note text',
    //     completed: false
    // }, (err, result) =>{
    //     if(err) {
    //        return console.log('Unable to insert note data', err);            
    //     }
    // console.log(`Inserted note - response ${JSON.stringify(result.ops, undefined, 2)}`);    
    // });
    
    // db.collection('Users').insertOne({
    //     name: 'Thilaks',
    //     age: 53,
    //     location: 'Chennai'
    // }, (err, result) =>{
    //     if(err) {
    //        return console.log('Unable to insert user data', err);            
    //     }
    // console.log(`Inserted User - response ${JSON.stringify(result.ops, undefined, 2)}`);    
    // });

    db.close();
});
