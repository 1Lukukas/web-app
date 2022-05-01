require('dotenv').config()
const request = require('supertest')
const app = require('../../app')(process.env.TEST_DATABASE_URL)
const User = require('../../models/user')
const Record = require('../../models/record')
const mongoose = require('mongoose');


describe('Test suite', () => {

    afterAll(async () =>{
        await mongoose.disconnect()
    })

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
            await new User({
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

        it('GET /users/me', async () =>{
            await new User({
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

    describe("Records API", () =>{

        beforeEach(async () => {
            await User.deleteMany({})
            await Record.deleteMany({})
        });

        afterEach(async () => {
            await User.deleteMany({})
            await Record.deleteMany({})
        });
        it('POST records/create2', async () => {
            await new User({
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

            response = await request(app).post('/records/create2')
            .set('Authorization', `Bearer ${response.body.accessToken}`)
            .send({amount:"222", recordType:"expense"})
            .expect(204)
        })

        it('GET records/all2', async () =>{
            await new User({
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
            const accessToken = response.body.accessToken

            response = await request(app).post('/records/create2')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({amount:"222", recordType:"expense"})
            .expect(204)

            response = await request(app).get('/records/all2')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect('Content-Type', /json/)
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        amount: expect.any(Number),
                        recordType: expect.any(String)
                    })
                ])
            );
        })
    })
})