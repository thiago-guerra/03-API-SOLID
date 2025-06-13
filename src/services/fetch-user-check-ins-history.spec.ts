import { beforeEach, describe,  expect,  it } from 'vitest';
import InMemoryCheckinsRepository from '../repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

let checkInRepository: InMemoryCheckinsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User CheckIns History Use Case', () =>{
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckinsRepository();
        sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
    });
   
     it('should be able to fetch check-in history', async () => {
        for(let i = 1; i <= 22; i++) {
            await checkInRepository.create({gym_id: `gym-${i}`, user_id: 'user-01'});
        }
    
        const response =  await sut.execute({
        userId: 'user-01',
        page: 1
        });

       expect(response.checkIns).toHaveLength(20);
       expect.objectContaining([
           {gym_id: 'gym-1'},
           {gym_id: 'gym-2'}
       ])
    })
});