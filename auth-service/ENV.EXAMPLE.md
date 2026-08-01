# Environment Variables Configuration

This project requires several environment variables to function properly. Create a `.env` file in the root directory of the project and populate it with your environment-specific values.

---

## 🛠 Required Variables

### 1. Database Configuration (PostgreSQL & Prisma)

| Variable       | Type     | Description                                                                                                             |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`      | `string` | The host address where the PostgreSQL database is running (e.g., `localhost` or Docker container name like `postgres`). |
| `DB_USER`      | `string` | Database username.                                                                                                      |
| `DB_PASSWORD`  | `string` | Database password.                                                                                                      |
| `DB_NAME`      | `string` | Name of the database to connect to.                                                                                     |
| `DB_PORT`      | `number` | Port on which PostgreSQL is listening (default: `5432`).                                                                |
| `DATABASE_URL` | `string` | Full PostgreSQL connection string required by Prisma ORM. Utilizes interpolation of the DB variables above.             |

---

### 2. Application & Server Setup

| Variable        | Type     | Description                                                                                                                   |
| :-------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `PORT`          | `number` | The HTTP port on which the NestJS application server will run (e.g., `3000`).                                                 |
| `NODE_ENV`      | `string` | Application environment mode (`development`, `production`, or `test`). Controls security features like cookie `secure` flags. |
| `ORIGIN_DOMAIN` | `string` | Allowed Origin URL for CORS configuration (e.g., `http://localhost:5173` for Vite/React frontend).                            |
| `JWT_SECRET`    | `string` | A strong, random secret key used to sign and verify JSON Web Tokens (JWT).                                                    |

---

### 3. Mailer Configuration (SMTP)

| Variable    | Type     | Description                                                                  |
| :---------- | :------- | :--------------------------------------------------------------------------- |
| `MAIL_HOST` | `string` | SMTP server hostname (e.g., `sandbox.smtp.mailtrap.io` or `smtp.gmail.com`). |
| `MAIL_PORT` | `number` | Port used by the SMTP server (e.g., `2525` or `587`).                        |
| `MAIL_USER` | `string` | SMTP authentication username.                                                |
| `MAIL_PASS` | `string` | SMTP authentication password / App Password.                                 |

---

## 📝 `.env.example` Template

Copy the snippet below into a `.env.example` file in your repository:

```env
# Server
PORT=3000
NODE_ENV=development
ORIGIN_DOMAIN=http://localhost:5173

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# Database Settings
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db
DB_PORT=5432

# Prisma Connection String
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# SMTP Mailer Settings (e.g., Mailtrap / SendGrid / Gmail)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password
```
