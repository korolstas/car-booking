### 🔐 Auth Service (`/auth-service`)

**Core Authentication & Identity Provider Microservice** built with NestJS, Prisma, and PostgreSQL. Handles complete user lifecycle, token management, and security controls.

- **Primary Responsibility:** Centralized identity management, authentication, and authorization.
- **Key Features:**
  - Dual JWT token issuance with **HttpOnly Cookies** & **Token Rotation**.
  - Password hashing (`bcrypt`) & hashed Refresh Tokens in PostgreSQL.
  - Automated transactional emails (Email verification, Password reset) via SMTP.
  - Rate limiting (Throttling) against brute-force attacks on sensitive endpoints.
- **Tech Stack:** NestJS, Prisma ORM, PostgreSQL, Passport.js, Nodemailer, Docker.
- **Docs & Setup:** See detailed setup guide in [`/auth-service/README.md`](./auth-service/README.md).
