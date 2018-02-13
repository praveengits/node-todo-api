var env = process.env.NODE_ENV || 'development';

console.log(`####### ENV ########  : ${env}`);
if( env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test')
{
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else {
    process.env.MONGODB_URI = 'mongodb://testuser:testuser123@ds235418.mlab.com:35418/todoapp';
}