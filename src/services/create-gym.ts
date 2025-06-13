import { Gym } from "@prisma/client";
import { IGymsRepository } from "@/repositories/gyms-repository";

interface CreateGymUseCaseRequest {
   tittle: string;
   description: string | null;
   phone: string;
   latitude: number;
   longitude: number;
}

interface ICreateGymUseCase { 
    gym: Gym;
}

export class CreateGymUseCase {
     
    constructor(private gymsRepository: IGymsRepository) {}
    async execute({ tittle, description, phone, latitude, longitude }: CreateGymUseCaseRequest) : Promise<ICreateGymUseCase> {
        
        const gym = await this.gymsRepository.create({
            tittle,
            description,
            phone,
            latitude,
            longitude
        });

        return { gym };
    }
}