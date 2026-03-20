export const productSchema = {
    type: 'object',
    required: ['_id', 'name', 'price','stock', 'category','mainImage','subImages', 'createdAt'],
    properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        category: { type: 'string' },
        owner: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        __v: { type: 'number' },
        stock: { type: 'number' },
        mainImage: {
            type: 'object',
            required: ['url', 'localPath', '_id'],
            properties: {
                url: { type: 'string' },
                localPath: { type: 'string' },
                _id: { type: 'string' }
            }
        },
        subImages: {
            type: 'array',
            items: {
                type: 'object',
                required: ['url', 'localPath', '_id'],
                properties: {
                    url: { type: 'string' },
                    localPath: { type: 'string' },
                    _id: { type: 'string' }
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