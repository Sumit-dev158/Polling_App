import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Simple Polling API',
            version: '1.0.0',
            description: 'A RESTful API for creating polls and voting',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: process.env.API_SERVER_URL || 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
