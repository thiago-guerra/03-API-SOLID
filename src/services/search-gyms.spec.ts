import InMemoryGymsRepository from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Fetch User CheckIns History Use Case', () =>{
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });
   
     it('should be able to search gyms', async () => {
         await gymsRepository.create({
            tittle: 'JavaScript Gym',
            description: '',    
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });
        
          await gymsRepository.create({
            tittle: 'Typescript Gym',
            description: '',    
            phone: '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });

        const response =  await sut.execute({
            query: 'Java',
            page: 1
        });

       expect(response.gyms).toHaveLength(1);
       expect(response.gyms).toEqual([
        expect.objectContaining({tittle: 'JavaScript Gym'})
       ])
    })

      it('should be able to search gyms paginated', async () => {
        for (let index = 1; index <= 22; index++) {
            await gymsRepository.create({
                tittle: `JavaScript Gym ${index}`,
                description: '',    
                phone: '',
                latitude: -27.2092052,
                longitude: -49.6401091
            });
        } 

        const response =  await sut.execute({
            query: 'Java',
            page: 2
        });

       expect(response.gyms).toHaveLength(2);
       expect(response.gyms).toEqual([
        expect.objectContaining({tittle: 'JavaScript Gym 21'}),
        expect.objectContaining({tittle: 'JavaScript Gym 22'})
       ])
    })
});