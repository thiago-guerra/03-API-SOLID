import { FastifyInstance } from "fastify";
import { register } from "./register-controller";
import { authenticate } from "./authenticate-controller";
import { profile } from "./profile-controller";
import verifyJWT from "@/http/middlewares/verify-jwt";
import { refreshToken } from "./refresh-token-controller";

export const userRoutes = async  (app: FastifyInstance) => { 
    app.post('/users', register);
    app.post('/sessions', authenticate);
    app.patch('/refreshToken', refreshToken);

    /** AUTHENTICATED */
    app.get('/me', { onRequest: verifyJWT }, profile);
}