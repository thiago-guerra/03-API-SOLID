import { Checkin, Prisma } from "@prisma/client";
import { ICheckInRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export default class InMemoryCheckinsRepository implements ICheckInRepository {
    public items: Checkin[] = [];
    async findById(id: string): Promise<Checkin | null> {
        const checkIn = this.items.find(item => item.id === id);
        if (!checkIn) {
            return null;
        }
        return checkIn;
    }
    async save(checkIn: Checkin): Promise<Checkin> {
        const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);
        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn;
        }
        return checkIn;
    }
    async countByUserId(userId: string): Promise<number> {
        return this.items.filter(item => item.user_id === userId).length;
    }
    async findManyByUserId(userId: string, page: number): Promise<Checkin[]> {
        const checkIns = this.items.filter(item => item.user_id === userId).slice((page - 1) * 20, page * 20);
        if (!checkIns) {
            return [];
        }else {
            return checkIns;
        }
        
    }
    async findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null> {
        const startOfTheDate = dayjs(date).startOf('date');
        const endOfTheDate = dayjs(date).endOf('date');
        
        const checkInOnSameDay = this.items.find((data)=> {
            const isOnTheSameDate = dayjs(data?.created_at).isAfter(startOfTheDate) && dayjs(data?.created_at).isBefore(endOfTheDate);
            return data.user_id === userId && isOnTheSameDate;
        });
        if (!checkInOnSameDay) {
            return null;
        }
        return checkInOnSameDay;
    }
   async create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin> {
       const checkIn: Checkin =  {
          id: randomUUID(),
          user_id: data.user_id,
          gym_id: data.gym_id,
          created_at: new Date(),
          validated_at: data.validated_at ? new Date(data.validated_at) : null
       }
       this.items.push(checkIn);
       return checkIn;
    }
}