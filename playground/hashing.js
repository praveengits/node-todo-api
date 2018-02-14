const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

jwt.sign

var data ={
    id: 7
};

var token = jwt.sign(data, 'abc123');
console.log(`token : ${token}`);

var decoded = jwt.verify(token, 'abc123')
console.log(decoded);


// var msg = "I am a user";
// var hash = SHA256(msg).toString();

// console.log(`Msg is ${msg}`);
// console.log(`Hashed Msg is ${hash}`);


// var data 