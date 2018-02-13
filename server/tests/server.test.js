const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectId(),
    text: 'Light the candles'
}, {
    _id: new ObjectId(),
    text: 'Mow the lawn'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
    
});

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
            .end((err, response) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => {
                    done(error);
                });
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
            }).end(done);
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