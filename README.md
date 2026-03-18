# 🔗 URL Shortener API

A production-grade REST API built with Node.js, Express, and MySQL that allow user to register/login and then create,update,get and delete notes.

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
- [API Reference](#api-reference)
  - [Health Check](#health-check)
  - [Shorten a URL](#shorten-a-url)
  - [Redirect to Original URL](#redirect-to-original-url)
  - [Get URL Stats](#get-url-stats)
- [Error Handling](#error-handling)
- [Key Design Decisions](#key-design-decisions)

---

## ✨ Features

- Allows user to register/login.
- Verify correct user using JWT.
- Users can create note, update a note by its id, get a note by its id, and delete a note by its id.
- User B cannot access User A's notes as every user has its private notes.
- Input validation with meaningful error messages
- Race condition safe with database-level unique constraints
- Clean layered architecture — routes, controllers, services, middleware

---

## 🛠 Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Runtime        | Node.js           |
| Framework      | Express.js        |
| Database       | MySQL             |
| DB Driver      | mysql2            |
| Validation     | express-validator |
| Config         | dotenv            |
| Dev Server     | nodemon           |
| Authentication | JWT               |

---

## 📁 Project Structure

```
url-shortener/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   └── authController.js  # Authentication Request/response handling
│   │   └── notesController.js # Notes Request/response handling
│   ├── middlewares/
│   │   ├── validate.js        # Validation runner middleware
│   │   └── authValidation.js  # Authentication specific validation rules
│   │   └── notesValidation.js # Note specific validation rules
│   │   └── verifyToken.js     # JWT verification middleware
│   ├── routes/
│   │   └── authRoutes.js      # Authentication Route definitions
│   │   └── notesRoutes.js     # Notes Route definitions
│   ├── services/
│   │   └── authService.js     # Auth-related Business logic and DB queries
│   │   └── notesService.js    # Note-related Business logic and DB queries
│   └── app.js                 # Express app setup
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                  # Entry point
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
git clone https://github.com/NewbieCodingGuy/notesapi.git
cd notesapi
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
DB_PASSWORD=password
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

### Create a User

Create a new user. If the user already exists, returns the error message.

```
POST /api/auth/register
```

**Request Body**

```json
{
  "name": "Sol",
  "email": "sol@example.com",
  "password": "123sol"
}
```

**Response — 201 Created**

```json
{
  "message": "Account created successfully",
  "user": {
    "id": 4,
    "name": "Sol",
    "email": "sol@example.com"
  }
}
```

**Validation Errors — 409 Conflict**

```json
{
  "error": "Email already in use!"
}
```

---

### Create a Note

Create a note for the logged in user

```
POST /api/notes
```

**Request Body**

```json
{
  "title": "Sol First Note",
  "content": "This is Sol's first note in this app"
}
```

**Response — 201 Created**

```json
{
  "message": "Note created successfully",
  "note": {
    "id": 5,
    "userId": 4,
    "title": "Sol First Note",
    "content": "This is Sol's first note in this app"
  }
}
```

---

### Get Note By Id

Retrieve a note by its id.

```
GET /api/notes/5
```

**Response — 200 OK**

```json
{
  "message": "Note fetched successfully",
  "note": {
    "id": 5,
    "user_id": 4,
    "title": "Sol First Note",
    "content": "This is Sol's first note in this app",
    "created_at": "2026-03-18T06:49:56.000Z",
    "updated_at": "2026-03-18T06:49:56.000Z"
  }
}
```

### Get all Notes for a user (User's private note and not other user's note)

Get all notes of a user

```
GET /api/notes
```

**Response — 200 Fetched**

```json
{
  "message": "All Notes Fetched Successfully",
  "notes": [
    {
      "id": 5,
      "user_id": 4,
      "title": "Sol First Note",
      "content": "This is Sol's first note in this app",
      "created_at": "2026-03-18T06:49:56.000Z",
      "updated_at": "2026-03-18T06:49:56.000Z"
    },
    {
      "id": 6,
      "user_id": 4,
      "title": "Sol Second Note",
      "content": "This is Sol's second note in this app",
      "created_at": "2026-03-18T07:03:53.000Z",
      "updated_at": "2026-03-18T07:03:53.000Z"
    }
  ]
}
```

### Update a Note by its ID

Update a note for the logged in user by the notes id

```
PUT /api/notes/6
```

**Request Body**

```json
{
  "title": "Updated Sol's Second Note",
  "content": "Updated Content For Sol's Second Note"
}
```

**Response — 200 Updated**

```json
{
  "message": "Note successfully updated!",
  "note": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "Rows matched: 1  Changed: 1  Warnings: 0",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 1
  }
}
```

### Delete a Note by its ID

Delete a note for the logged in user by the notes id

```
DELETE /api/notes/6
```

**Response — 200 Deleted**

```json
{
  "message": "Note deleted successfully",
  "note": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 0
  }
}
```

---

## ⚠️ Error Handling

All endpoints follow a consistent error response format:

| Status Code | Meaning                                                    |
| ----------- | ---------------------------------------------------------- |
| 200         | Success — resource fetched                                 |
| 201         | Success — resource created                                 |
| 302         | Redirect — following short URL                             |
| 400         | Bad Request — malformed request                            |
| 404         | Not Found — resource does not exist                        |
| 422         | Unprocessable Entity — validation failed                   |
| 500         | Internal Server Error — something went wrong on the server |

---

## 🏗 Key Design Decisions

**Layered Architecture**
Routes, controllers, services, and middleware each have a single responsibility. Business logic lives exclusively in the service layer — controllers only handle HTTP input and output.

**Connection Pooling**
Uses `mysql2` connection pool with a limit of 10 connections. This allows concurrent requests to be handled efficiently without overwhelming the database.

**Parameterized Queries**
All database queries use `?` placeholders to prevent SQL injection attacks — never string concatenation.

**Input Handling**
Before inserting a new data, the service checks if it already exists.

**Validation Middleware**
Input validation is handled at the middleware layer using `express-validator` before the request ever reaches the controller. Controllers can safely assume the request is clean.
