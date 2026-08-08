# Water Intake Tracker - Backend

Backend API for the Water Intake Tracker application.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Current Features

- Express server setup
- MongoDB connection
- User schema
- Intake log schema
- User-to-intake relationship
- Environment-based configuration
- Health check API
- Global error handling

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/rsbamil/water-intake-tracker-backend
cd water-intake-tracker-backend

## Admin Setup

Run:

```bash
npm run create-admin


## Intake Features

- Log water intake
- View today's total intake
- View daily goal
- Calculate hydration progress
- View historical intake totals
- Delete personal intake entries
- Ownership protection for intake entries

## API Endpoints

### Authentication

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |

### Intake

| Method | Endpoint | Authentication |
|---|---|---|
| POST | `/api/intake` | Yes |
| GET | `/api/intake/today` | Yes |
| GET | `/api/intake/history` | Yes |
| DELETE | `/api/intake/:id` | Yes |

## Intake Request

```json
{
  "amount": 500
}