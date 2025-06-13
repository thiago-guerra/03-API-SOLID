import { Checkin } from "@prisma/client";
import { ICheckInRepository } from "@/repositories/check-ins-repository";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinate";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins";

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
    checkIn: Checkin;
}

export class CheckInUseCase {
    constructor(private checkInRepository: ICheckInRepository, private gymsRepository: IGymsRepository){}

    async execute ({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest) : Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distanceToGymInMeters = getDistanceBetweenCoordinates({latitude: userLatitude, longitude: userLongitude}, { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() });

        if (distanceToGymInMeters > 0.1) {
            throw new MaxDistanceError();
        }

        const checkInOnSameDay =  await this.checkInRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckInsError();
        }
        
        const checkIn = await this.checkInRepository.create({gym_id: gymId, user_id: userId });

        return { checkIn  };
    }
}