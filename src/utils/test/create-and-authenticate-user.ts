import { FastifyInstance } from "fastify";
import request from 'supertest';

export default async function createAndAuthenticateUser(app: FastifyInstance) {
    
    // create user
    await request(app.server).post('/users')
    .send({ name: 'John Doe', email: 'johndoee2e@example.com', password: '123456' });
        
    // login
    const { body } = await request(app.server).post('/sessions')
    .send({ email: 'johndoee2e@example.com', password: '123456'});

    return {
        token: body.token
    }
}