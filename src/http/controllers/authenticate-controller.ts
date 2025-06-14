import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from "@services/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@services/factories/make-authenticate-use-case";

 export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchemma = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });
    
    try {
        const { email,  password } = authenticateBodySchemma.parse(request.body);
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user} = await authenticateUseCase.execute({ email, password });

       const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }});

        return reply.status(200).send({ token });

    } catch (e) {
        if (e instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: e.message });
        }
        
        throw e;
    }
}