const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/user');

let mongoServer;
let app;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);

    const mod = require('../src/index');
    app = mod.app || mod.io?.httpServer;

    // Create a user and get token
    const user = new User({
        name: 'Requester',
        email: 'req@example.com',
        passwordHash: 'hashed',
        location: { type: 'Point', coordinates: [-0.09, 51.505] }
    });
    await user.save();
    userId = user._id;

    // Mock login/token generation if needed, or just use a library to sign one
    const jwt = require('jsonwebtoken');
    token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET || 'secret');
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Requests Endpoints', () => {
    it('should create a new request', async () => {
        const res = await request(app)
            .post('/api/requests')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'Help Needed',
                description: 'Test Request',
                contact: '123',
                lat: 51.505,
                lng: -0.09
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.type).toEqual('Help Needed');
    });

    it('should fetch nearby requests', async () => {
        const res = await request(app)
            .get('/api/requests')
            .query({ lat: 51.505, lng: -0.09, radiusKm: 10 });

        if (res.statusCode !== 200) {
            console.log('Fetch Requests Error:', res.body);
        }
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });
});
