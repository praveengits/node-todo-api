const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateUsers, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done)=> {
        var text = 'test todo Text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo - Invalid data', (done)=> {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)            
            .end((err, response) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);                   
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
});

describe('GET /todos', () => {
    it('should get all the todos', (done)=> {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            }).end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should get todo doc for the :id passed', (done)=> {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);

    });
    it('should return 404 for the :id passed', (done)=> {
        var hexId = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)            
            .end(done);
    });
    it('should return 404 for non ids', (done)=> {
        request(app)
            .get(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo doc for the :id passed', (done)=> {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            }).end((err, response) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();                   
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
    it('should return 404 for the :id passed', (done)=> {
        var hexId = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)            
            .end(done);
    });
    it('should return 404 for non ids', (done)=> {
        request(app)
            .delete(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo doc for the :id passed', (done)=> {
        var hexId = todos[1]._id.toHexString();
        var sendBody = {
            text: 'Updated text',
            completed: true
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .send(sendBody)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text)
                    .toBe(sendBody.text);
                expect(res.body.todo.completed)
                    .toBe(true);
                expect(res.body.todo.completedAt)
                    .toNotBe(null);
            }).end(done);
    });
    it('should set completed at to null for complted=false', (done)=> {
        var hexId = todos[0]._id.toHexString();
        var sendBody = {
            completed: false
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .send(sendBody)
            .expect(200)
            .expect((res) => {                
                expect(res.body.todo.completed)
                    .toBe(false);
                expect(res.body.todo.completedAt)
                    .toBe(null);
            }).end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 for unauthenticated user', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});                
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create user and authenticate', (done)=>{
        var email = 'servertest@test.com';
        var password = 'asdf1234';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);               
            })
            .end((err, response) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist(); 
                    expect(user.password).toNotBe(password);                  
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return validation errors if request is invalid', (done)=>{
        var email = 'testuser6@test.com';
        var password = 'asdf';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email already exists', (done)=>{
        var email = users[0].email;
        var password = 'asdf1234';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users', () => {
    it('should login user with valid credentials', (done)=>{
        var email = users[1].email;
        var password = users[1].password;
  
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);               
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {                    
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });                  
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
    it('should reject login - invalid credentials', (done)=>{
        var email = users[1].email;
        var password = 'qwer123444';
  
        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();                        
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {                    
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
});

describe('DELETE /users/me',() => {
    it('should logout user by deleting token', (done) =>{
        request(app)
            .delete('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBe('null');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {                    
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
})