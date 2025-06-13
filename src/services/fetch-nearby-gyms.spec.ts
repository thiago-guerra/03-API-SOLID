import InMemoryGymsRepository from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch User CheckIns History Use Case', () =>{
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });
   
     it('should be able to search gyms', async () => {
        await gymsRepository.create({
            tittle: 'Near Gym',
            description: '',    
            phone: '',
            latitude: -8.0264968,
            longitude: -34.9128391
        });

        await gymsRepository.create({
            tittle: 'Far Gym',
            description: '',    
            phone: '',
            latitude: -7.6284316,
            longitude: -34.8180667
        });
        
        const { gyms } = await sut.execute({
            userLatitude: -8.0114144,
            userLongitude: -34.9230565
        });

       expect(gyms).toHaveLength(1);
       expect(gyms).toEqual([
        expect.objectContaining({tittle: 'Near Gym'})
       ])
    })
});