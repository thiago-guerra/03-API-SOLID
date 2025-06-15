import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { makeValidateCheckInUseCase } from "@/services/factories/make-validate-check-in-use-case";

 export async function validateCheckIns (request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId  } = validateCheckInsSchema.parse(request.params);
    
    const validateCheckInsUseCase = makeValidateCheckInUseCase();
    
    await validateCheckInsUseCase.execute({
       checkInId
    });
   
    return reply.status(204).send();
}