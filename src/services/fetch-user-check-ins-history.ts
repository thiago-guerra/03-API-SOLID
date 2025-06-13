import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string;
    page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: Checkin [];
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkInRepository: ICheckInRepository){}

    async execute ({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest) : Promise<FetchUserCheckInsHistoryUseCaseResponse> {
        const checkIns = await this.checkInRepository.findManyByUserId(userId, page);

        if (!checkIns) {
           throw new ResourceNotFoundError();
        }
       
        return { checkIns };
    }
}