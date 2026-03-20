import {expect, test} from "@playwright/test"
import {faker} from "@faker-js/faker"
import * as dotenv from 'dotenv';
dotenv.config({debug: false, quiet: true});

test.describe('Регистрация негативные тесты', () =>{
    const ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD;
    if (!ADMIN_USER_PASSWORD) {
        throw new Error('ADMIN_USER_PASSWORD не задан в .env файле');
    }

    const registerUser = [
        {email: 'nevermind.com', expected: 422, errors: [{ email: 'Email is invalid' }], description: 'невалидный без @'},
        {email: 'never@mind@.com', expected: 422, errors: [{ email: 'Email is invalid' }], description: 'невалидный c двумя @'},
        {email: '', expected: 422, errors: [{ email: 'Email is required' },{ email: 'Email is invalid' }], description: 'не заполненное поле'},
        {email: 's@s.s', expected: 422, errors: [{ email: 'Email is invalid' }], description: 'слишком короткий'},
    ]
        registerUser.forEach(({email, expected, errors, description}) => {
            test(`Проверка валидации email - ${description}`, async ({request}) => {

                const registerData = {
                    email: email,
                    password: ADMIN_USER_PASSWORD,
                    role: "ADMIN",
                    username: faker.internet.userName().toLowerCase()
                }
                const response = await request.post('users/register', {
                    data: registerData
                })
                expect(response.status()).toBe(expected);
                const body = await response.json();
                expect(body.errors.length).toBe(errors.length);

                // Проверяем каждую ожидаемую ошибку
                errors.forEach((expectedError, index) => {
                expect(body.errors[index]).toEqual(expectedError);
            })
        })
    })
        test('Повторная регистрация с тем же email и username - ответ 409', async ({request}) => {
            const registerUser = {
                email: faker.internet.email().toLowerCase(),
                password: ADMIN_USER_PASSWORD,
                role: "ADMIN",
                username: faker.internet.userName().toLowerCase()
            }
            const response_first = await request.post('users/register', {
                data: registerUser
            });
            expect(response_first.status()).toBe(201);

            const response_last = await request.post('users/register', {
                data: registerUser,
            })
            expect(response_last.status()).toBe(409);
            const body = await response_last.json();
            expect(body.message).toBe('User with email or username already exists');
        })
    test('Регистрация пользователя менее чем с 3 буквами', async ({request}) => {
        const registerUser = {
            email: faker.internet.email().toLowerCase(),
            password: ADMIN_USER_PASSWORD,
            role: "ADMIN",
            username: faker.string.alphanumeric(2).toLowerCase(),
        }
        const response_first = await request.post('users/register', {
            data: registerUser
        });
        expect(response_first.status()).toBe(422);

        const body = await response_first.json();
        expect(body.errors.length).toBe(1);
        expect(body.errors[0].username).toBe('Username must be at lease 3 characters long');
    })
    test('Регистрация пользователя с именем в верхнем регистре', async ({request}) => {
        const registerUser = {
            email: faker.internet.email().toLowerCase(),
            password: ADMIN_USER_PASSWORD,
            role: "ADMIN",
            username: faker.person.firstName()
        }
        const response = await request.post('users/register', {
            data: registerUser
        });
        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
        expect(body.errors[0].username).toBe('Username must be lowercase');
    })
    test('Регистрация пользователя без обязательного поля password', async ({request}) => {
        const registerUser = {
            email: faker.internet.email().toLowerCase(),
            role: "ADMIN",
            username: faker.internet.userName().toLowerCase()
        }
        const response = await request.post('users/register', {
            data: registerUser
        });
        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
        expect(body.errors[0].password).toBe('Password is required');
    })
})