import verifyJWT from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { createGym } from "./create-gyms-controller";
import { searchGyms } from "./search-gyms-controller";
import { nearbyGyms } from "./nearby-gyms-controller";

export const gymsRoutes = async  (app: FastifyInstance) => { 
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms', createGym);
    
    app.get('/gyms', searchGyms);
    app.get('/gyms/nearby', nearbyGyms);
}