import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeSearchGymsUseCase } from "@/services/factories/make-search-gyms-use-case";

 export async function searchGyms (request: FastifyRequest, reply: FastifyReply) {
    const searchGymsBodySchemma = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const { page, q  } = searchGymsBodySchemma.parse(request.body);
    
    const searchGymsUseCase = makeSearchGymsUseCase();
    
    const { gyms } = await searchGymsUseCase.execute({
       query: q,
       page
    });
   
    return reply.status(200).send({ gyms });
}