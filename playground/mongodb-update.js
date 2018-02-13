// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if (err) {
        return console.log('unable to connect to Mongo DB');        
    } 
    console.log('Connected to MongoDB server!');    
    // "text" : "Wash clothes",
    // "completed" : false

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a83173bd4882d1f0ae58134')
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(`Updated Document : \n 
    //                 ${JSON.stringify(res, undefined, 2)}`);        
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a8312b6c2c54c0554da20cf')
    },{
        $set: {
            name: 'Thilagavathi'
        },
        $inc:{
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(`Updated Document : \n 
                    ${JSON.stringify(res, undefined, 2)}`);        
    });

    // db.close();
});