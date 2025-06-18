import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { prisma } from "@/lib/prisma";

describe('Metrics of user', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to list user metrics', async () => {
        const { token} = await createAndAuthenticateUser(app);
        const user = await prisma.user.findFirstOrThrow();
       
        const gym = await prisma.gym.create({
            data: {
                tittle: 'JavaScript Gym',
                description: '',
                phone: '',
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        await prisma.checkin.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id
                },
                {
                    gym_id: gym.id,
                    user_id: user.id
                }
            ]
        });

        const response = await request(app.server)
        .get('/check-ins/metrics')
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.count).toEqual(2);
    })
});