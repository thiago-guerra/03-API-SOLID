import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: './prisma/vitest-environment-prisma/prisma-test-environment.ts',
    }
})