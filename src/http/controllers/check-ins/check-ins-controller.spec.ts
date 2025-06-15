import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

describe('Create CheckIn', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to create check-in', async () => {
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

        const { gym } = response.body;
        const checkInResponse =  await request(app.server).post(`/gyms/${gym.id}/check-ins` )
        .send({
            latitude: -27.2092052,
            longitude: -49.6401091
        })
        .set('Authorization', `Bearer ${token}`);
        
        expect(checkInResponse.statusCode).toEqual(201);

    })
});