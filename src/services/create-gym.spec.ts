import InMemoryGymsRepository from "../repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    })

    it('should be able to create gym', async () => {
        sut.execute({
            tittle: 'JavaScript Gym 1',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        })
    })
});