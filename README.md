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

## API Endpoints

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Check API status |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | User/Admin | Get authenticated user |

### User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | User/Admin | Get own profile |
| PUT | `/api/users/me/goal` | User/Admin | Update own daily goal |
| DELETE | `/api/users/me` | User | Delete own account |

### Intake

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/intake` | User/Admin | Log water intake |
| GET | `/api/intake/today` | User/Admin | Get today's intake |
| GET | `/api/intake/history` | User/Admin | Get intake history |
| DELETE | `/api/intake/:id` | User/Admin | Delete own intake |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get user details |
| GET | `/api/users/:id/intake` | Admin | Get user's intake history |
| PUT | `/api/users/:id/goal` | Admin | Update user's daily goal |
| DELETE | `/api/users/:id` | Admin | Delete user |