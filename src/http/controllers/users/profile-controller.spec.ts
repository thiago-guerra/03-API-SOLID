import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { app } from '@/app';

describe("Profile (e2e)", async () => {
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get user profile', async () => {
        // create user
        await request(app.server).post('/users')
        .send({ name: 'John Doe', email: 'johndoee2e@example.com', password: '123456' });
        
        // login
        const { body } = await request(app.server).post('/sessions')
        .send({ email: 'johndoee2e@example.com', password: '123456'});

        // get profile
        const responseProfile = await request(app.server).get('/me').send().set('Authorization', `Bearer ${body.token}`);

        expect(responseProfile.statusCode).toEqual(200);
        expect(responseProfile.body).toEqual(expect.objectContaining({email: 'johndoee2e@example.com' }));
    })
});