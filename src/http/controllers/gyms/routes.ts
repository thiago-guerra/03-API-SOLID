import verifyJWT from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createGym } from "./create-gyms-controller";
import { searchGyms } from "./search-gyms-controller";
import { nearbyGyms } from "./nearby-gyms-controller";
import verifyUserRoles from "@/http/middlewares/verify-user-roles";

export const gymsRoutes = async  (app: FastifyInstance) => { 
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms', { onRequest: verifyUserRoles('ADMIN') }, createGym);
    
    app.get('/gyms/search', searchGyms);
    app.get('/gyms/nearby', nearbyGyms);
}