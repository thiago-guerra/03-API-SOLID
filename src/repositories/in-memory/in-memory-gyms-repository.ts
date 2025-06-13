import { Gym, Prisma } from "@prisma/client";
import { IGymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "../../utils/get-distance-between-coordinate";

export default class InMemoryGymsRepository implements IGymsRepository {
    public items: Gym[] = [];
    async searchMany(query: string, page: number): Promise<Gym[]> {
        const gyms = this.items.filter(item => item.tittle.includes(query)).slice((page - 1) * 20, page * 20);
        if (!gyms) {
            return [];
        }
        return gyms;
    }
    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym = {
            id: data.id ?? randomUUID(),
            tittle: data.tittle,
            description: data.description ?? null,
            phone: data.phone,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString())
        };
        
        this.items.push(gym);
        return gym;
    }
    async findById(id: string): Promise<Gym | null> {
        const gym = await this.items.find(item => item.id === id);
        if (!gym) {
            return null;
        }
        return gym;
    }

    async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
        const gyms = this.items.filter(item => {
            const distance = getDistanceBetweenCoordinates({
                latitude,
                longitude
            }, {
                latitude: item.latitude.toNumber(),
                longitude: item.longitude.toNumber()
            }
            );
             
            return distance < 20;
        });
       
        return gyms ? gyms : [];
    }
}