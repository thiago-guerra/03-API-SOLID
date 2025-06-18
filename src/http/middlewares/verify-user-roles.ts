import { FastifyReply, FastifyRequest } from "fastify";

export default function verifyUserRoles (roleToVerify: 'ADMIN' | 'GYM') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.user.role !== roleToVerify) {
            return reply.status(401).send({ message: 'Unauthorized' }); 
        }
    }
}

