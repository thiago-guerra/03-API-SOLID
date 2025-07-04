import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export default class InMemoryUsersRepository implements IUsersRepository {
    async findById(id: string): Promise<User | null> {
           const user = await this.items.find(item => item.id === id);
        if (!user) {
            return null;
        }
        return user;
    }
    public items: User[] = [];
   async create(data: Prisma.UserCreateInput): Promise<User> {
       const user =  {
           id: randomUUID(),
           name: data.name,
           email: data.email,
           password_hash: data.password_hash,
           created_at: new Date(),
       }
       this.items.push(user);
       return user;
    }
   async findByEmail(email: string) {
        const user = await this.items.find(item => item.email === email);
        if (!user) {
            return null;
        }
        return user;
    }

}