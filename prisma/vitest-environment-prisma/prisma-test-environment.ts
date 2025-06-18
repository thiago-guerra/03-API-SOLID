import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { URL } from "node:url";
import { Environment } from "vitest/environments";

const prisma = new PrismaClient();

function generateURL(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable.');
    }
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schema);
    return url.toString();
}

export default <Environment> {
    name: 'prisma',
    transformMode: 'web',
    async setup() { 
        console.log('Prisma Test Environment Setup');
        const schema = randomUUID();
        const databaseURL = generateURL(schema);
        console.log(' databaseurl', databaseURL);
        process.env.DATABASE_URL = databaseURL;

        execSync("npx prisma migrate deploy");

        return {
            async teardown() {
             console.log('Prisma Test Environment Teardown');

            await  prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
            await prisma.$disconnect();
            }
        }
    },
}