import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateGymUseCase } from "@/services/factories/make-create-gym-use-case";

 export async function createGym (request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchemma = z.object({
        tittle: z.string(),
        description: z.string().nullable(),
        phone: z.string(),
        latitude: z.coerce.number().refine(value => { return Math.abs(value) <= 90 }),
        longitude: z.coerce.number().refine(value => { return Math.abs(value) <= 180 }),
    });

    const { tittle, description, phone, latitude, longitude  } = createGymBodySchemma.parse(request.body);
    const createGymUseCase = makeCreateGymUseCase();
    
    await createGymUseCase.execute({
        tittle,
        description,
        phone,
        latitude,
        longitude
    });
   
    return reply.status(201).send();
}