import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { app } from '@/app';

describe("Refresh Token (e2e)", async () => {
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to refresh token', async () => {
        // create user
         await request(app.server).post('/users')
        .send({ name: 'John Doe', email: 'johndoee2e@example.com', password: '123456' });
        
        // authenticate
         const authenticateResponse = await request(app.server).post('/sessions')
        .send({ email: 'johndoee2e@example.com', password: '123456'});

        expect(authenticateResponse.statusCode).toEqual(200);

        const cookies = authenticateResponse.get('Set-Cookie') || [];

        // refresh token
        const refreshResponse = await request(app.server)
        .patch('/refreshToken')
        .set('Cookie', cookies)
        .send();
       
        expect(refreshResponse.statusCode).toEqual(200);
        expect(refreshResponse.body).toEqual({ token: expect.any(String) });
        expect(refreshResponse.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ]);
    });
});