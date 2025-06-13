import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import InMemoryUsersRepository from '../repositories/in-memory/in-memory-users-repository';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () =>{
    beforeEach(() => {
         usersRepository = new InMemoryUsersRepository();
         sut = new RegisterUseCase(usersRepository);
    });

    it('should be able to register', async () => {

        const { user } = await sut.execute({
        name: 'John Doe',
        email: 'joe@joe',
        password: '123456'
       });

       expect(user.id).toEqual(expect.any(String));
    })

    it('should hash user password upon registration', async () => {
        await sut.execute({
        name: 'John Doe',
        email: 'joe@joe',
        password: '123456'
       });
       
        await expect(async () => await  sut.execute({
        name: 'John Doe',
        email: 'joe@joe',
        password: '123456'
       })).rejects.toBeInstanceOf(UserAlreadyExistsError);

    })
});