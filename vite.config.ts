import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
    },
    resolve: {
        alias: {
            "@services": path.resolve(__dirname, './src/services'),
            "@repositories": path.resolve(__dirname, './src/repositories'),
            "@utils": path.resolve(__dirname, './src/utils'),
            "@lib": path.resolve(__dirname, './src/lib'),
            "@/app": path.resolve(__dirname, './src/app'),
        }
    }
})