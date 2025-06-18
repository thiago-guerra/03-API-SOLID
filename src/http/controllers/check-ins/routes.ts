import verifyJWT from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { checkIns } from "./check-ins-controller";
import { userMetrics } from "./check-ins-user-metrics-controller";
import { validateCheckIns } from "./validate-check-ins-controller";
import { checkInsHistory } from "./check-ins-history-controller";
import verifyUserRoles from "@/http/middlewares/verify-user-roles";

export const checkInsRoutes = async  (app: FastifyInstance) => { 
    app.addHook('onRequest', verifyJWT);

    app.post('/gyms/:gymId/check-ins', checkIns);
    app.patch('/check-ins/:checkInId/validate',  { onRequest: verifyUserRoles('ADMIN') }, validateCheckIns);

    app.get('/check-ins/metrics', userMetrics);
    app.get('/check-ins/history', checkInsHistory);
}