import { afterEach, beforeEach, describe,  expect,  it, vi } from 'vitest';
import { CheckInUseCase } from './check-in';
import InMemoryCheckinsRepository from '../repositories/in-memory/in-memory-check-ins-repository';
import InMemoryGymsRepository from '../repositories/in-memory/in-memory-gyms-repository';

let checkInRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;

let sut: CheckInUseCase;

describe('CheckIn Use Case', () =>{
    beforeEach(async () => {
         checkInRepository = new InMemoryCheckinsRepository();
         gymsRepository = new InMemoryGymsRepository();
         sut = new CheckInUseCase(checkInRepository, gymsRepository);
         vi.useFakeTimers();

        await gymsRepository.create({
            id: 'gym-01',
            tittle: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check-in use case', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
       });

       expect(checkIn.id).toEqual(expect.any(String));
    })

    it('should not be able to check-in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
       });

      await expect (() => sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
       })).rejects.toBeInstanceOf(Error);   

    })
    
    it('should be able to check-in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
       });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
       });

       expect(checkIn.id).toEqual(expect.any(String));   
    })

     it('should not be able checkin on distant gym more than 100m', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await gymsRepository.create({
            id: 'gym-02',
            tittle: 'JavaScript Gym2',
            description: '',
            phone: '',
            latitude: -7.9993584,
            longitude: -34.8996504,
        });

        await expect(() =>  sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
        })).rejects.toBeInstanceOf(Error);
    })
});