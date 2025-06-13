import InMemoryCheckinsRepository from "../repositories/in-memory/in-memory-check-ins-repository";
import { beforeAll, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkinsRepository: InMemoryCheckinsRepository;
let sut: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
    beforeAll(() => {
        checkinsRepository = new InMemoryCheckinsRepository();
        sut = new GetUserMetricsUseCase(checkinsRepository);
    });

    it('should be able to get count of check-ins by user metrics', async () => {
        await checkinsRepository.create({gym_id: 'gym-01', user_id: 'user-01'});
        await checkinsRepository.create({gym_id: 'gym-01', user_id: 'user-01'});
        await checkinsRepository.create({gym_id: 'gym-02', user_id: 'user-01'});

       const response =  await sut.execute({userId: 'user-01'});
       expect(response.count).toEqual(expect.any(Number));
       expect(response.count).toEqual(3);
    })
});