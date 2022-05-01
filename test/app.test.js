require('dotenv').config()
const { response } = require('express')
const request = require('supertest')
const app = require('../app')(process.env.TEST_DATABASE_URL)
const User = require('../models/user')

describe('Users API', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    });

    afterEach(async () => {
        await User.deleteMany({})
    });

    it('POST /users/login', async () => {
        await request(app).post('/users/create')
        .send('email=test&username=test&password=test')
        .expect(204)
    });

    it('GET /users/all', async () => {
        const response = await request(app).get('/users/all')
        .expect(200)
        expect(response.body).toEqual([]);
        //with data here
    });

    it('POST /users/create', async () =>{
        const user = await new User({
            email: "test",
            username: "test",
            password: "test",
          }).save()

        const response = await request(app).post('/users/login')
        .send({
            username: "test",
            email: "test",
            password: "test"
        })
        .expect(200)
        expect(response.body.accessToken).toBeTruthy();
    })

    it('POST /users/me', async () =>{
        const user = await new User({
            email: "test",
            username: "test",
            password: "test",
          }).save()

        let response = await request(app).post('/users/login')
        .send({
            username: "test",
            email: "test",
            password: "test"
        })
        .expect(200)
        expect(response.body.accessToken).toBeTruthy();

        response = await request(app).get('/users/me')
        .set('Authorization', `Bearer ${response.body.accessToken}`)
        .expect(200)

        expect(response.body).toEqual(
            expect.objectContaining({
              username: 'test',
              email: 'test',
              password: 'test'
            })
        );
    })
})