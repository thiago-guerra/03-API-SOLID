import { makeGetUserProfileUseCase } from '@services/factories/make-get-user-profile-use-case';
import {FastifyRequest, FastifyReply } from 'fastify';
import verifyJWT from '../middlewares/verify-jwt';

 export async function profile (request: FastifyRequest, reply: FastifyReply) {
    await verifyJWT(request, reply);

    const getUserProfile = makeGetUserProfileUseCase();
    const { user } = await getUserProfile.execute({userId: request.user.sub});

    return reply.status(200).send({ ...user, password_hash: undefined });
}