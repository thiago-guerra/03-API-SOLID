import { z } from "zod";
import {FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/services/factories/make-authenticate-use-case";

 export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchemma = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });
    
    try {
        const { email,  password } = authenticateBodySchemma.parse(request.body);
        const authenticateUseCase = makeAuthenticateUseCase();
        const { user} = await authenticateUseCase.execute({ email, password });

        const token = await reply.jwtSign(
            { 
                role: user.role 
            },
            {
                sign: {
                    sub: user.id
                }
            });

         const refreshToken = await reply.jwtSign(
            {
                role: user.role
            }, {
            sign: {
            sub: user.id,
            expiresIn: '7d'
        }});

        return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: true
        })
        .status(200).send({ token });

    } catch (e) {
        if (e instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: e.message });
        }
        
        throw e;
    }
}