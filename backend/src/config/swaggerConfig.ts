export default {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CS732 Project API',
            version: '1.0.0',
            description: 'API documentation for the CS732 project',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Base URL of your API
            },
        ],
    },
    apis: ['./src/controllers/**/*.ts'], // Path to your controller files
};