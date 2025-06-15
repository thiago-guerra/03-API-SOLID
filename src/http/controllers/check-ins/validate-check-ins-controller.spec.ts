import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app';
import createAndAuthenticateUser from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { prisma } from "@/lib/prisma";

describe('Validate CheckIn', () => {
    beforeAll(async () => {
        app.ready();
    });

    afterAll(async () => {
        app.close();
    });

    it('should be able to validate check-in', async () => {
        const { token} = await createAndAuthenticateUser(app);

        const createGymResponse = await request(app.server).post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            tittle: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });

        const { gym } = createGymResponse.body;
        const checkInResponse =  await request(app.server).post(`/gyms/${gym.id}/check-ins` )
        .send({
            latitude: -27.2092052,
            longitude: -49.6401091
        })
        .set('Authorization', `Bearer ${token}`);

        
        const validateResponse = await request(app.server)
        .patch(`/check-ins/${checkInResponse.body.checkIn.id}/validate`)
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(validateResponse.statusCode).toEqual(204);

        const checkInValidated = await prisma.checkin.findUniqueOrThrow({
            where: {
                id: checkInResponse.body.checkIn.id
            }
        });
        expect(checkInValidated.validated_at).toEqual(expect.any(Date));
    })
});