import { IUsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface IRegisterUseCase { 
    user: User
}

export class RegisterUseCase {
     
    constructor(private userRepository: IUsersRepository) {}
    async execute({ name, email, password }: RegisterUseCaseRequest) : Promise<IRegisterUseCase> {
        const password_hash = await hash(password, 6);
        
        const userAlreadyExists = await this.userRepository.findByEmail(email);
        
        if (userAlreadyExists) {
            throw new UserAlreadyExistsError(); 
        }
        
        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
        });

        return { user };
    }
}