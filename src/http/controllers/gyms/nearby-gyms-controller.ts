import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeFetchNearbyGymsUseCase } from "@/services/factories/make-fetch-nearby-gyms-use-case";

 export async function nearbyGyms (request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsBodySchemma = z.object({
        latitude: z.number().refine(value => { return Math.abs(value) <= 90 }),
        longitude: z.number().refine(value => { return Math.abs(value) <= 180 }),
    });

    const { latitude, longitude  } = nearbyGymsBodySchemma.parse(request.body);
    
    const fetchNearbyGyms = makeFetchNearbyGymsUseCase();
    
    const { gyms } = await fetchNearbyGyms.execute({
      userLatitude: latitude,
      userLongitude: longitude
    });
   
    return reply.status(200).send({ gyms });
}