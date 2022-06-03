const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { userOneId, userOne, userTwo, setupDataBase, taskOne } = require('./fixtures/db');
beforeEach(setupDataBase);
test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.owner).toEqual(userOneId)
});

test('should get all taks for an user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const tasks = await Task.find({})
    expect(tasks).not.toBeNull()
    expect(response.body.length).toEqual(2)
});

test('should not delete task of other user', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
});




