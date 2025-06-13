import { Gym } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { IGymsRepository } from "../repositories/gyms-repository";

interface ISearchGymsUseCaseRequest {
    query: string;
    page: number;
}

interface ISearchGymsUseCaseResponse {
    gyms: Gym[];
}

export class SearchGymsUseCase {
     
    constructor(private gymsRepository: IGymsRepository) {}
    async execute({ query, page }: ISearchGymsUseCaseRequest) : Promise<ISearchGymsUseCaseResponse> {
        
        const gyms = await this.gymsRepository.searchMany(query, page);
        
        if (!gyms) {
            throw new ResourceNotFoundError(); 
        }
        
        return { gyms };
    }
}