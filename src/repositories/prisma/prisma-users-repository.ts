import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "@/repositories/users-repository";

export default class PrismaUsersRepository implements IUsersRepository {
    async findById(id: string): Promise<User | null> {
      const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
      return user;
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
      return user;
    }
    async create(data: Prisma.UserCreateInput)  {
      const user = await prisma.user.create({
        data
      });

      return user
    }

}