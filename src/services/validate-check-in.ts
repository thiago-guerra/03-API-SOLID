import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";

interface IValidateCheckInUseCaseRequest {
   checkInId: string;
}

interface IValidateCheckInUseCaseResponse {
    checkIn: Checkin;
}

export class ValidateCheckInUseCase {
    constructor(private checkInRepository: ICheckInRepository){}

    async execute ({ checkInId }: IValidateCheckInUseCaseRequest) : Promise<IValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError();
        }

        const differenceInMinutesFromCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes');

        if (differenceInMinutesFromCreation > 20) {
            throw new Error();
        }
        
        checkIn.validated_at = new Date();
      
        const savedCheckIn =  await this.checkInRepository.save(checkIn);

        return { checkIn: savedCheckIn };
    }
}