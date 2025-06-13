import { FastifyInstance } from "fastify";
import { register } from "./controllers/register-controller";
import { authenticate } from "./controllers/authenticate-controller";
import { profile } from "./controllers/profile-controller";

export const appRoutes = async  (app: FastifyInstance) => { 
    app.post('/users', register);
    app.post('/sessions', authenticate);

    /** AUTHENTICATED */
    app.get('/me', profile);
}