import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

describe('Nearby Gyms', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to list nearby gyms', async () => {
        const { token} = await createAndAuthenticateUser(app);

        await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -8.0264968,
            longitude: -34.9128391
        });

        await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'TypeScript Gym',
            description: '',
            phone: '',
            latitude: -7.6284316,
            longitude: -34.8180667
        });

        const response = await request(app.server)
        .get('/gyms/nearby')
        .query({ latitude: -8.0114144, longitude: -34.9230565 })
        .send()
        .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ tittle: 'JavaScript Gym' })
        ]);
    })
});