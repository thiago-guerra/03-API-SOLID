import verifyJWT from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { checkIns } from "./check-ins-controller";
import { checkInsHistory } from "./check-ins-history-controller";
import { userMetrics } from "./check-ins-user-metrics-controller";
import { validateCheckIns } from "./validate-check-ins-controller";

export const checkInsRoutes = async  (app: FastifyInstance) => { 
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms/:gymId/check-ins', checkIns);
    app.patch('/check-ins/:checkInId/validate', validateCheckIns);

    app.get('/check-ins/history', checkInsHistory);
    app.get('/check-ins/metrics', userMetrics);

}