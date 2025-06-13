import { Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { IGymsRepository } from "../repositories/gyms-repository";

interface IFetchNearbyGymsUseCaseRequest {
    userLatitude: number;
    userLongitude: number;
}

interface IFetchNearbyGymsUseCaseResponse {
    gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
     
    constructor(private gymsRepository: IGymsRepository) {}
    async execute({ userLatitude, userLongitude }: IFetchNearbyGymsUseCaseRequest) : Promise<IFetchNearbyGymsUseCaseResponse> {
        
        const gyms = await this.gymsRepository.findManyNearby(userLatitude, userLongitude,);
        
        if (!gyms) {
            throw new ResourceNotFoundError(); 
        }
        
        return { gyms };
    }
}