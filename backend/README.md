# Find My Laundry API

Express 5 + MySQL 8 backend. See [`../BACKEND-MYSQL-QUICK-START.md`](../BACKEND-MYSQL-QUICK-START.md) for local setup, Railway deployment, API endpoints, and Git workflow.

## Folder structure

```text
backend/
├── database/
│   └── schema.sql
├── scripts/
│   └── init-db.js
├── src/
│   ├── config/
│   │   └── env.js
│   ├── db/
│   │   ├── init.js
│   │   └── pool.js
│   ├── middleware/
│   │   └── error-handler.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── shops.routes.js
│   ├── utils/
│   │   ├── otp.js
│   │   └── password.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── security-utils.test.js
├── .env.example
├── package.json
└── railway.json
```

## Local commands

```powershell
Copy-Item .env.example .env
npm install
npm run db:init
npm test
npm run dev
```

Create the local MySQL database before running the initializer. The backend requires Node.js 22.13+ and a running MySQL server.

## Security notes

- All database values are passed as SQL parameters.
- Passwords are hashed with Node.js `scrypt`.
- OTPs are hashed before being saved.
- OTPs are short-lived and limited to five incorrect attempts.
- Console OTP delivery is development-only. Production registration stays disabled until an email provider is configured.
- Never commit `.env` or real credentials.
