![Tests](https://github.com/NewbieCodingGuy/notesapi/actions/workflows/ci.yml/badge.svg)

# 📝 Notes API

A production-grade REST API built with Node.js, Express, and MySQL where users can register, log in, and privately manage their own notes. Each user's notes are completely isolated — no user can access another user's data.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Auth Endpoints](#auth-endpoints)
  - [Notes Endpoints](#notes-endpoints)
- [Error Handling](#error-handling)
- [Key Design Decisions](#key-design-decisions)

---

## ✨ Features

- User registration and login with secure password hashing
- Stateless authentication using JWT
- Full CRUD operations for personal notes
- Private note ownership — users can only access their own notes
- Input validation with meaningful error messages
- Clean layered architecture — routes, controllers, services, middleware

---

## 🛠 Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Runtime          | Node.js           |
| Framework        | Express.js        |
| Database         | MySQL             |
| DB Driver        | mysql2            |
| Password Hashing | bcryptjs          |
| Authentication   | jsonwebtoken      |
| Validation       | express-validator |
| Config           | dotenv            |
| Dev Server       | nodemon           |

---

## 📁 Project Structure

```
notes-api/
├── src/
│   ├── config/
│   │   └── db.js                # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js    # Auth request/response handling
│   │   └── notesController.js   # Notes request/response handling
│   ├── middlewares/
│   │   ├── validate.js          # Validation runner middleware
│   │   ├── authValidation.js    # Auth-specific validation rules
│   │   ├── notesValidation.js   # Notes-specific validation rules
│   │   └── verifyToken.js       # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js        # Auth route definitions
│   │   └── notesRoutes.js       # Notes route definitions
│   ├── services/
│   │   ├── authService.js       # Auth business logic and DB queries
│   │   └── notesService.js      # Notes business logic and DB queries
│   └── app.js                   # Express app setup
├── .env                         # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- npm (comes with Node.js)

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/notes-api.git
cd notes-api
```

2. **Install dependencies**

```bash
npm install
```

---

### Database Setup

Open MySQL Workbench or your MySQL client and run the following:

```sql
CREATE DATABASE notes_api;

USE notes_api;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### Environment Variables

Create a `.env` file in the root of the project:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notes_api
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=15m
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

### Running the Server

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
Server running on port 3000
✅ Database connected successfully
```

---

## 🔐 Authentication Flow

This API uses JWT (JSON Web Tokens) for stateless authentication. Here is how to authenticate:

**Step 1 — Register an account**

```
POST /api/auth/register
```

**Step 2 — Log in to receive a token**

```
POST /api/auth/login
```

Copy the `token` value from the response.

**Step 3 — Send the token with every protected request**

Add the following header to all notes requests:

```
Authorization: Bearer <your_token_here>
```

**Step 4 — Token expiry**

Tokens expire after 15 minutes. When expired, log in again to receive a new token. Any request with an expired token returns `401 Unauthorized`.

> ⚠️ Never share your token. It identifies you to the API and grants full access to your notes.

---

## 📡 API Reference

### Health Check

Check if the server is running.

```
GET /health
```

**Response — 200 OK**

```json
{
  "status": "ok"
}
```

---

### Auth Endpoints

#### Register

Create a new user account.

```
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response — 201 Created**

```json
{
  "message": "Account created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response — 409 Conflict** _(email already registered)_

```json
{
  "error": "Email already in use"
}
```

**Response — 422 Unprocessable Entity** _(validation failed)_

```json
{
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

---

#### Login

Log in and receive a JWT access token.

```
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response — 200 OK**

```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response — 401 Unauthorized** _(wrong credentials)_

```json
{
  "error": "Invalid email or password"
}
```

---

### Notes Endpoints

> All notes endpoints require the `Authorization: Bearer <token>` header.

---

#### Get All Notes

Retrieve all notes belonging to the authenticated user.

```
GET /api/notes
```

**Response — 200 OK**

```json
{
  "message": "All Notes Fetched Successfully",
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "created_at": "2026-03-18T06:49:56.000Z",
      "updated_at": "2026-03-18T06:49:56.000Z"
    }
  ]
}
```

> Returns an empty array `[]` if the user has no notes. This is not an error.

---

#### Get Note by ID

Retrieve a single note by its ID. Only returns the note if it belongs to the authenticated user.

```
GET /api/notes/:id
```

**Response — 200 OK**

```json
{
  "message": "Note fetched successfully",
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "created_at": "2026-03-18T06:49:56.000Z",
    "updated_at": "2026-03-18T06:49:56.000Z"
  }
}
```

**Response — 404 Not Found** _(note doesn't exist or belongs to another user)_

```json
{
  "error": "No note exist with this id!"
}
```

---

#### Create Note

Create a new note for the authenticated user.

```
POST /api/notes
```

**Request Body**

```json
{
  "title": "My First Note",
  "content": "This is the content of my first note."
}
```

**Response — 201 Created**

```json
{
  "message": "Note created successfully",
  "note": {
    "id": 1,
    "userId": 1,
    "title": "My First Note",
    "content": "This is the content of my first note."
  }
}
```

---

#### Update Note

Update the title and content of an existing note. Only works if the note belongs to the authenticated user.

```
PUT /api/notes/:id
```

**Request Body**

```json
{
  "title": "Updated Title",
  "content": "Updated content for this note."
}
```

**Response — 200 OK**

```json
{
  "message": "Note successfully updated!"
}
```

**Response — 404 Not Found**

```json
{
  "error": "Note not found"
}
```

---

#### Delete Note

Delete a note by its ID. Only works if the note belongs to the authenticated user.

```
DELETE /api/notes/:id
```

**Response — 200 OK**

```json
{
  "message": "Note deleted successfully"
}
```

**Response — 404 Not Found**

```json
{
  "error": "Note not found"
}
```

---

## ⚠️ Error Handling

All endpoints return consistent error responses in this format:

```json
{ "error": "Description of what went wrong" }
```

| Status Code | Meaning                                                         |
| ----------- | --------------------------------------------------------------- |
| 200         | Success — resource fetched or action completed                  |
| 201         | Success — resource created                                      |
| 401         | Unauthorized — missing, invalid, or expired token               |
| 404         | Not Found — resource does not exist or belongs to another user  |
| 409         | Conflict — resource already exists (e.g. duplicate email)       |
| 422         | Unprocessable Entity — request understood but validation failed |
| 500         | Internal Server Error — something went wrong on the server      |

---

## 🏗 Key Design Decisions

**Layered Architecture**
Routes, controllers, services, and middleware each have a single responsibility. Business logic lives exclusively in the service layer — controllers only handle HTTP input and output.

**Stateless JWT Authentication**
No sessions are stored on the server. The JWT token carries the user's identity and is verified on every request. This approach scales horizontally — any number of servers can verify the same token without sharing state.

**Password Hashing with bcrypt**
Passwords are hashed using bcrypt with 10 salt rounds before storage. The original password is never stored or recoverable. Even if the database is compromised, passwords remain protected.

**Resource-Level Authorization**
Every notes query filters by both the note ID and the authenticated user's ID. A user requesting another user's note receives a `404` — not a `403`. This reveals nothing about whether the resource exists at all.

**Connection Pooling**
Uses `mysql2` connection pool with a limit of 10 connections. Pre-opened connections are reused across requests, avoiding the overhead of creating a new connection on every request.

**Parameterized Queries**
All database queries use `?` placeholders — never string concatenation. This prevents SQL injection attacks at the database driver level.

**Validation Middleware**
Input validation runs at the middleware layer before requests reach the controller. Controllers can safely assume the incoming data is clean and valid.

**Foreign Key with CASCADE Delete**
The `notes.user_id` column references `users.id` with `ON DELETE CASCADE`. Deleting a user automatically removes all their notes — no orphaned data, enforced at the database level.
