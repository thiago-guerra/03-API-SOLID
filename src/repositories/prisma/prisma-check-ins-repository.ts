import { Prisma, Checkin } from "@prisma/client";
import { ICheckInRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export default class PrismaCheckInsRepository implements ICheckInRepository {
    async create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin> {
        return await prisma.checkin.create({
            data
        });
    }
    async findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null> {
        const startOfTheDate = dayjs(date).startOf('date');
        const endOfTheDate = dayjs(date).endOf('date');
        
        const checkInOnSameDay = await prisma.checkin.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDate.toDate(),
                    lte: endOfTheDate.toDate(),
                }
            }
        });
       
        return checkInOnSameDay;
    }
    async findManyByUserId(userId: string, page: number): Promise<Checkin[]> {
        return await prisma.checkin.findMany({
            take: 20,
            skip: (page -1) * 20,
            where: {
                user_id: userId
            }
        })
    }
    async countByUserId(userId: string): Promise<number> {
        return await prisma.checkin.count({
            where: {
                user_id: userId
            }
        })
    }
    async findById(id: string): Promise<Checkin | null> {
        return await prisma.checkin.findUnique({
            where: {
                id: id
            }
        });
    }
    async save(checkIn: Checkin): Promise<Checkin> {
    return await prisma.checkin.update({
        where: {
            id: checkIn.id
        },
        data: checkIn
      })
    }
}