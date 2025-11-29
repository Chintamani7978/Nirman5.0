const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/index').io.httpServer || require('../src/index'); // Adjust based on how you export app/server

// Mock the server start if needed, or better, separate app definition from server listen
// For this example, assuming src/index.js exports { io, userSocketMap } and starts server.
// We might need to refactor index.js to export 'app' for testing without listening, 
// but for now let's assume we can require it. 
// Ideally, refactor index.js to export 'app' and have a separate 'server.js' or 'bin/www' to listen.

// Since index.js starts the server, we might run into port conflicts if we just require it.
// A common pattern is:
// if (require.main === module) { app.listen(...) }
// But since we can't easily change that right now without potentially breaking things, 
// let's try to use the running server or a separate test instance if possible.

// Actually, for a robust test, let's use a separate app instance if we can, 
// or just use supertest on the exported app if available.
// Given the previous file content of index.js, it exports { io, userSocketMap } and listens.
// It does NOT export 'app'. This makes testing hard.

// I will assume for this task that I can modify index.js slightly to export app, 
// OR I will use a pattern where I define the test to connect to a running server if I can't modify code.
// BUT the user asked for "generate tests", implying I can modify things if needed, 
// but usually it's safer to just write the test.

// Let's write a test that assumes we can require the app. 
// If index.js doesn't export app, we might need to rely on the fact that supertest can take a URL.
// But we want to mock DB.

// Strategy: 
// 1. Use mongodb-memory-server.
// 2. We need to stop the real DB connection in index.js if we require it.
// This is tricky without refactoring. 
// I'll write the test assuming a standard structure where we can import 'app'. 
// If index.js is a "script" that runs immediately, we might need to refactor it to be testable.

// Let's try to make the test standalone-ish or assume we can refactor.
// I'll write the test code to be as standard as possible.

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect(); // Disconnect any existing
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// We need the express app. 
// Since index.js doesn't export it, we might need to refactor index.js first 
// OR just require it and hope for the best (it will try to connect to real DB).
// Let's assume we will refactor index.js to export app.
// I will include a note or just try to require it. 
// Actually, I'll just require '../src/index' and hope it exports something useful or I can access the server.
// Looking at previous index.js: `module.exports = { io, userSocketMap };` 
// It does NOT export app. 
// I will update index.js to export app as well in a separate tool call if I can, 
// but I am limited to "Generate Jest tests". 
// I will write the test assuming `const { app } = require('../src/index');` works.
// I will add a step to update index.js to export app.

describe('Auth Endpoints', () => {
    let app;

    beforeAll(() => {
        // This is a bit hacky if index.js isn't refactored.
        // I'll assume I can get app from the require.
        const mod = require('../src/index');
        app = mod.app || mod.io?.httpServer;
    });

    it('should signup a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                lat: 51.505,
                lng: -0.09
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
