export const productSchema = {
    type: 'object',
    required: ['_id', 'name', 'price', 'stock', 'category', 'mainImage', 'subImages'],
    properties: {
        // Основные бизнес-поля
        _id: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        category: { type: 'string' },
        description: { type: 'string' },  // опционально

        // Изображения
        mainImage: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string' }
                // localPath и _id — технические, не проверяем
            }
        },
        subImages: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    url: { type: 'string' }
                    // localPath и _id — технические, не проверяем
                }
            }
        }
    }
};

export const registerResponseSchema = {
    type: 'object',
    required: ['_id', 'username', 'email', 'role'],
    properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    }
};

export const loginResponseSchema = {
    type: 'object',
    required: ['accessToken', 'refreshToken'],
    properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' }
    }
};

export const userSchema = {
    type: 'object',
    required: ['_id', 'email', 'username', 'role'],
    properties: {
        _id: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' }
    }
};