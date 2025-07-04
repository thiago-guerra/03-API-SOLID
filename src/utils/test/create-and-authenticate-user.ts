import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from 'supertest';

export default async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
    
    await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'johndoee2e@example.com',
            password_hash: await hash('123456', 6),
            role: isAdmin ? 'ADMIN' : 'MEMBER'
        }
    })
        
    // login
    const { body } = await request(app.server).post('/sessions')
    .send({ email: 'johndoee2e@example.com', password: '123456'});

    return {
        token: body.token
    }
}