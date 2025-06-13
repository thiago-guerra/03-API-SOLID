import { Environment } from "vitest/environments";

export default <Environment> {
    name: 'prisma',
    transformMode: 'ssr',
    async setup() { 
        console.log('Prisma Test Environment Setup');
        return {
            async teardown() {
             console.log('Prisma Test Environment Teardown');
            }
        }
    },
}