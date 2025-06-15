import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

describe('Create Gym', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to create gym', async () => {
        const { token} = await createAndAuthenticateUser(app);

        const response = await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });

        expect(response.statusCode).toEqual(201);
    })
});