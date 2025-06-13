import { ICheckInRepository } from "@/repositories/check-ins-repository";

interface IGetUserMetricsUseCaseRequest {
    userId: string
}

interface IGetUserMetricsUseCaseResponse {
   count: number;
}

export class GetUserMetricsUseCase {
     
    constructor(private checkinsRepository: ICheckInRepository) {}
    async execute({ userId }: IGetUserMetricsUseCaseRequest) : Promise<IGetUserMetricsUseCaseResponse> {
        const count = await this.checkinsRepository.countByUserId(userId);
        
        return { count };
    }
}