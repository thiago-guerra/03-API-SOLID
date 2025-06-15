import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";

describe("Profile (e2e)", async () => {
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be able to get user profile', async () => {
        const { token } = await createAndAuthenticateUser(app);

        // get profile
        const responseProfile = await request(app.server).get('/me').send().set('Authorization', `Bearer ${token}`);

        expect(responseProfile.statusCode).toEqual(200);
        expect(responseProfile.body).toEqual(expect.objectContaining({email: 'johndoee2e@example.com' }));
    })
});