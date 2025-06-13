import { FastifyReply, FastifyRequest } from "fastify";

export default async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch {
        reply.status(401).send({ message: 'Unauthorized' });
    }
}