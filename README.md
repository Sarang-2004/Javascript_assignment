# College Appointment Booking System (Node.js + MongoDB)

A backend API for managing student-professor appointment bookings, built with Node.js, Express, and MongoDB. The system supports user authentication, slot management, and appointment booking/cancellation, with a clean, scalable, and testable codebase.

---

## Features
- **User Authentication**: Register/login as student or professor (JWT-based)
- **Slot Management**: Professors specify available slots
- **Appointment Booking**: Students book/cancel appointments
- **Role-based Access**: Professors and students have different permissions
- **Automated Testing**: End-to-end tests with Jest and Supertest
- **Dockerized**: Easy setup for both app and MongoDB

---

## Project Structure
```
.
├── controllers/         # Business logic for each resource
├── routes/              # API route definitions
├── middleware/          # Authentication and other middleware
├── models/              # Mongoose schemas for User, Slot, Appointment
├── config/              # Database connection config
├── seed.js              # Manual DB seeding script for development
├── index.js             # Main app entry point
├── index.test.js        # Automated E2E tests
├── Dockerfile           # Docker image for app
├── docker-compose.yml   # Multi-container setup (app + MongoDB)
└── README.md            # Project documentation
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/products/docker-desktop) (for easy DB setup)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Javascript_assignment
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://root:example@localhost:27017/
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Start MongoDB (with Docker)
```bash
docker-compose up -d
```

### 4. (Optional) Seed the Database
To add default users (A1, A2, P1) for development:
```bash
node seed.js
```

### 5. Start the Application
```bash
npm install
npm start
```
The server will run on [http://localhost:3000](http://localhost:3000)

---

## API Overview

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT

### Professor Endpoints
- `POST /api/professors/:profId/slots` — Specify available slots (professor only)
- `DELETE /api/appointments` — Cancel an appointment (professor only)

### Student Endpoints
- `GET /api/professors/:profId/slots` — View available slots for a professor
- `POST /api/appointments` — Book an appointment (student only)
- `GET /api/appointments` — View your appointments (student only)

> **All protected endpoints require an `Authorization: Bearer <token>` header.**

---

## Running Tests

Automated end-to-end tests are provided:
```bash
npm test
```
- Tests cover login, slot creation, booking, cancellation, and data integrity.
- Output is verbose and step-by-step for easy demonstration.

---

## Development Notes
- **No automatic seeding**: Use `node seed.js` to add demo users for development.
- **Environment variables**: Never commit your `.env` file.
- **Extensible**: Add new features by creating new models, controllers, and routes.
- **Error handling**: All endpoints return appropriate status codes and error messages.

---

## Example Users (after seeding)
| Username | Password    | Role      |
|----------|-------------|-----------|
| A1       | student1    | student   |
| A2       | student2    | student   |
| P1       | professor1  | professor |

---

## License
MIT 