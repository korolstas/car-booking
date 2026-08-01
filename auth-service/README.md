# 🔐 Auth Service (NestJS)

A production-ready, highly secure **Authentication & Authorization Microservice** built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and [PostgreSQL](https://www.postgresql.org/).

---

## ✨ Features

- **🔐 Robust JWT Authentication**:
  - Short-lived Access Tokens returned in HTTP responses.
  - Long-lived Refresh Tokens stored exclusively in **`HttpOnly` Cookies** (`SameSite: Lax`, `Secure` in production).
  - **Token Rotation**: Generates a new token pair on every refresh call.
  - **Hashed Refresh Tokens**: Refresh tokens are hashed using `bcrypt` before saving to PostgreSQL.
- **📧 Mailer Module (`src/mail`)**:
  - Email confirmation flow for new user registrations.
  - Password recovery notifications (`forgot-password` & `reset-password`).
- **🛡 Throttler & Security Module (`src/throttler`)**:
  - Rate limiting on sensitive routes to protect against brute-force attacks.
- **🛠 Common Utilities (`src/common`)**:
  - Global Exception Filters (`filters/`).
  - Custom Decorators like `@GetUser()` (`decorators/`).
  - Centralized application constants (`constants/`).
- **🐳 Docker Ready**:
  - `docker-compose.yml` included for easy local database and service orchestration.

---

## 📂 Project Structure

```text
auth-service/
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── auth/                # Core Auth domain
│   │   ├── dto/             # Request payloads validation (Register, Login, etc.)
│   │   ├── guards/          # JwtAuthGuard and security guards
│   │   ├── strategies/      # Passport JWT strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── common/              # Shared infrastructure
│   │   ├── constants/       # App constants
│   │   ├── decorators/      # Custom decorators (e.g. @GetUser)
│   │   └── filters/         # Global exception filters
│   ├── mail/                # Mailing module
│   │   ├── mail.module.ts
│   │   └── mail.service.ts
│   ├── throttler/           # Rate limiting configuration
│   │   └── throttler.module.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Entry point (CookieParser, CORS, Global Pipes/Filters)
├── .env                     # Local environment variables
├── .prettierrc              # Code formatting config
├── docker-compose.yml       # Docker Compose setup for PostgreSQL / Mailtrap
├── ENV.EXAMPLE.md           # Environment variables documentation
├── eslint.config.mjs        # ESLint flat config
├── nest-cli.json            # NestJS CLI configuration
└── package.json
```

## 🛠 Tech Stack

- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** Passport.js (`passport-jwt`), `bcrypt`, `cookie-parser`, `@nestjs/throttler`
- **Email:** Nodemailer (SMTP)
- **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (v18+ recommended)
- **Docker & Docker Compose** (optional, for database setup)

---

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Setup

Check `ENV.EXAMPLE.md` for a complete list of environment variables. Create a `.env` file in the root directory:

### 4. Database Setup

Start PostgreSQL via Docker (if using docker-compose.yml):

```bash
docker-compose up -d
```

Run Prisma migrations to create database schema:

```bash
npx prisma migrate dev --name init
npx prisma studio
```

### 5. Running the Application

```bash
# Development mode
npm run start:dev

# Production build & start
npm run build
npm run start:prod
```

The server will start at http://localhost:3000 (or your defined PORT).

## 📡 API Endpoints

### 🔑 Auth Controller (`/auth`)

| Method | Endpoint                | Access / Guard  | Description                                                                                |
| :----- | :---------------------- | :-------------- | :----------------------------------------------------------------------------------------- |
| `POST` | `/auth/register`        | Rate Limited    | Registers a new user and sends verification email.                                         |
| `GET`  | `/auth/verify-email`    | Public          | Confirms user email address.                                                               |
| `POST` | `/auth/login`           | Rate Limited    | Authenticates user, returns `accessToken` in body, sets `refreshToken` in HttpOnly cookie. |
| `POST` | `/auth/refresh-token`   | Cookie Required | Rotates tokens: issues new `accessToken` and updates `refreshToken` cookie.                |
| `POST` | `/auth/logout`          | `JwtAuthGuard`  | Clears `refreshToken` in DB and removes client cookie.                                     |
| `POST` | `/auth/forgot-password` | Rate Limited    | Sends password reset token via email.                                                      |
| `POST` | `/auth/reset-password`  | Rate Limited    | Resets user password using reset token.                                                    |
