# Simple Polling API

A RESTful API for creating polls and voting, built with Node.js, Express, and MongoDB.

## Features

- Create polls with multiple options
- List all polls
- Vote on poll options
- View poll results with vote counts
- IP-based vote restriction (one vote per IP per poll)
- Swagger API documentation

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Documentation:** Swagger/OpenAPI
- **Module System:** ES Modules

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-polling-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polling-api
API_SERVER_URL=http://localhost:5000
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | - |
| `API_SERVER_URL` | Base server URL for Swagger and API docs | `http://localhost:5000` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/polls` | Create a new poll |
| GET | `/api/polls` | Get all polls |
| GET | `/api/polls/:id` | Get poll by ID with vote counts |
| POST | `/api/polls/:id/vote` | Vote on a poll option |

## API Documentation

Interactive Swagger documentation is available at the URL configured in `API_URL` environment variable.

Default: `http://localhost:5000/api-docs`

## Usage Examples

### Create a Poll
```bash
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is your favorite programming language?",
    "options": ["JavaScript", "Python", "Java", "Go"]
  }'
```

### Get All Polls
```bash
curl http://localhost:5000/api/polls
```

### Vote on a Poll
```bash
curl -X POST http://localhost:5000/api/polls/<poll-id>/vote \
  -H "Content-Type: application/json" \
  -d '{"optionIndex": 0}'
```

### Get Poll Details
```bash
curl http://localhost:5000/api/polls/<poll-id>
```

## Project Structure

```
simple-polling-api/
├── config/
│   └── db.js           # Database connection
├── models/
│   └── Poll.js         # Poll mongoose model
├── routes/
│   └── pollRoutes.js   # API routes
├── index.js            # App entry point
├── swagger.js          # Swagger configuration
├── nodemon.json        # Nodemon configuration
├── package.json
├── .env                # Environment variables
└── README.md
```

## License

MIT
