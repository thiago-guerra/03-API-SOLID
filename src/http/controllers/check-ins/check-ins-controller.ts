import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeCheckInUseCase } from "@/services/factories/make-check-in-use-case";

 export async function checkIns (request: FastifyRequest, reply: FastifyReply) {
   
    const checkInBodySchemma = z.object({
        latitude: z.number().refine(value => { return Math.abs(value) <= 90 }),
        longitude: z.number().refine(value => { return Math.abs(value) <= 180 }),
    });

     const gymIdParamsSchemma = z.object({
        gymId: z.string().uuid(),
     });

    const { latitude, longitude } = checkInBodySchemma.parse(request.body);
    const { gymId } = gymIdParamsSchemma.parse(request.params);    
    
    const checkInUseCase = makeCheckInUseCase();
    
    const { checkIn } =  await checkInUseCase.execute({
       gymId,
       userId: request.user.sub,
       userLatitude: latitude,
       userLongitude: longitude
    });
   
    return reply.status(201).send({ checkIn });
}