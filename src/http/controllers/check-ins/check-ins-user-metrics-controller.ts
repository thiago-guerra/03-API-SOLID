import {FastifyRequest, FastifyReply } from 'fastify';
import { makeGetUserMetricsUseCase } from "@/services/factories/make-get-user-metrics-use-case";

 export async function userMetrics (request: FastifyRequest, reply: FastifyReply) {
    const userMetricsUseCase = makeGetUserMetricsUseCase();
    
    const { count } = await userMetricsUseCase.execute({
        userId: request.user.sub
    });
   
    return reply.status(200).send({ count });
}