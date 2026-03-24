import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

const ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD!;

export function generateValidUser(overrides = {}) {
    return {
        email: faker.internet.email().toLowerCase(),
        password: ADMIN_USER_PASSWORD,
        role: "ADMIN",
        username: faker.internet.userName().toLowerCase(),
        ...overrides
    };
}