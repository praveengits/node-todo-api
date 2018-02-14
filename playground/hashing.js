const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password ="123abc";

// bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);        
//     });
// });

var hashVal = '$2a$10$gFwCXI2eXSVXlPX8A4YesukGD7RM7ykKhgyLhUK7bGNy7PsW1AeRC';

bcrypt.compare(password, hashVal, (err, isMatch)=> {
    console.log(isMatch);
});

// jwt.sign

// var data ={
//     id: 7
// };

// var token = jwt.sign(data, 'abc123');
// console.log(`token : ${token}`);

// var decoded = jwt.verify(token, 'abc123')
// console.log(decoded);


// var msg = "I am a user";
// var hash = SHA256(msg).toString();

// console.log(`Msg is ${msg}`);
// console.log(`Hashed Msg is ${hash}`);


// var data 