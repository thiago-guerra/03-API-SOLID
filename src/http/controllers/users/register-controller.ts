import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { UserAlreadyExistsError } from "@services/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@services/factories/make-register-use-case";

 export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchemma = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    });

    const { email, name, password } = registerBodySchemma.parse(request.body);
    try {
        const registerUseCase = makeRegisterUseCase();
    
        await registerUseCase.execute({ name, email, password });
    } catch (e) {
        if (e instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: e.message });
        }
        
        throw e;
    }
    return reply.status(201).send();
}