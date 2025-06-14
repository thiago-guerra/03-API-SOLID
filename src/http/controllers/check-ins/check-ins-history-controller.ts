import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeFetchUserCheckInsHistoryUseCase } from "@/services/factories/make-fetch-user-check-ins-history";

 export async function checkInsHistory (request: FastifyRequest, reply: FastifyReply) {
    const searchGymsBodySchemma = z.object({
        page: z.coerce.number().min(1).default(1)
    });

    const { page  } = searchGymsBodySchemma.parse(request.body);
    
    const checkInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
    
    const { checkIns } = await checkInsHistoryUseCase.execute({
        userId: request.user.sub,
        page 
    });
   
    return reply.status(200).send({ checkIns });
}