import { FastifyInstance } from "fastify";
import { register } from "./register-controller";
import { authenticate } from "./authenticate-controller";
import { profile } from "./profile-controller";
import verifyJWT from "@http/middlewares/verify-jwt";

export const userRoutes = async  (app: FastifyInstance) => { 
    app.post('/users', register);
    app.post('/sessions', authenticate);

    /** AUTHENTICATED */
    app.get('/me', { onRequest: verifyJWT }, profile);
}