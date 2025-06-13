import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import InMemoryCheckinsRepository from "../repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInRepository: InMemoryCheckinsRepository;  
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckinsRepository();
        sut = new ValidateCheckInUseCase(checkInRepository);
        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to validate check-in', async () => {
        const createdCheckIn =  await checkInRepository.create({gym_id: 'gym-01', user_id: 'user-01'});

        const { checkIn  } = await sut.execute({checkInId: createdCheckIn.id});

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
    })

    it('should not be able to validate check-in', async () => {

     await expect(() => sut.execute({checkInId: 'not-exists-id'})).rejects.toBeInstanceOf(ResourceNotFoundError); 
    })

    it('should not be able to validate check-in after 20min of creation', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
        const createdCheckIn =  await checkInRepository.create({gym_id: 'gym-01', user_id: 'user-01'});

        const twentyOneMinutesInMs = 1000 * 60 * 21;    
        vi.useFakeTimers();
        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(() => sut.execute({checkInId: createdCheckIn.id})).rejects.toBeInstanceOf(Error);
    });
});