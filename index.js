import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import pollRoutes from './routes/pollRoutes.js';
import swaggerSpec from './swagger.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Trust proxy for getting client IP
app.set('trust proxy', true);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/polls', pollRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Simple Polling API',
        documentation: '/api-docs',
        endpoints: {
            'POST /api/polls': 'Create a new poll',
            'GET /api/polls': 'Get all polls',
            'GET /api/polls/:id': 'Get poll by ID with vote counts',
            'POST /api/polls/:id/vote': 'Vote on a poll option'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: ${process.env.API_SERVER_URL}/api-docs`);
});

// Graceful shutdown handling
const shutdown = () => {
    console.log('\nShutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });

    // Force close after 3 seconds if server hasn't closed
    setTimeout(() => {
        console.log('Forcing shutdown...');
        process.exit(1);
    }, 3000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

