import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

describe('Search Gyms', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to search gyms', async () => {
        const { token} = await createAndAuthenticateUser(app, true);

        await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });

        await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'TypeScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });

        const response = await request(app.server)
        .get('/gyms/search')
        .query({ q: 'JavaScript' })
        .send()
        .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                tittle: 'JavaScript Gym'
            })
        ])
    })
});