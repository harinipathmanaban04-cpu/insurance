# THE BEST INSURANCE POINT — Full-Stack Insurance Application

A modern, full-stack insurance advisory platform featuring dynamic category-based insurance application forms (Car, Bike, Commercial Vehicle, Health, and Life Insurance), real server-side mobile SMS OTP verification, MongoDB persistence, Brevo transactional email notifications, and an admin management portal.

---

## 1. Project Structure

```text
best-insurance-point/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/                 # Static assets (favicons, robots.txt)
│   ├── src/
│   │   ├── assets/             # Images, partner logos, vehicle icons
│   │   ├── components/         # Reusable UI components & Navbar/Footer
│   │   │   ├── ApplicationForm/ # Dynamic category forms & OTP wizard
│   │   │   └── ...
│   │   ├── data/               # Insurance categories, reviews, partners
│   │   ├── pages/              # Route pages (Home, Car, Bike, Health, Admin...)
│   │   ├── services/           # Frontend API client (api.js)
│   │   ├── App.jsx             # Main router
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Proxies /api -> http://localhost:5000 in dev
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # MongoDB connection & constants
│   │   ├── controllers/        # Application, OTP & Callback controllers
│   │   ├── middleware/         # Rate limiting, validation & error handler
│   │   ├── models/             # Mongoose schemas (Customer, Application...)
│   │   ├── routes/             # Express API routes (/api/*)
│   │   ├── services/           # Brevo Email API & SMS Gateway adapters
│   │   ├── app.js              # Express app definition (CORS, parsers, routes)
│   │   └── index.js            # Local server listener
│   ├── package.json
│   └── .env.example
│
├── api/                        # Vercel serverless function entry points
│   └── index.js                # Serverless bridge to Express backend
├── vercel.json                 # Vercel deployment routing & rewrites
├── package.json                # Root package with workspace scripts
└── README.md
```

---

## 2. Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed

### Step A: Start the Backend Server
```bash
cd server
npm install
npm run dev
# Backend starts at: http://localhost:5000
# API Health Check: http://localhost:5000/api/health
```

### Step B: Start the Frontend Client
```bash
# In a new terminal window:
cd client
npm install
npm run dev
# Frontend starts at: http://localhost:5173
```
*Note: Vite automatically proxies all `/api/*` requests from port 5173 to port 5000 during local development.*

---

## 3. Backend API Endpoints

### Mobile OTP Verification (`/api/otp`)
- `POST /api/otp/send` — Generates a secure 6-digit OTP, enforces rate limiting & cooldown, dispatches SMS via real provider, and returns a signed HMAC session token. *(OTP is never exposed to the client).*
- `POST /api/otp/verify` — Validates OTP against the session token. On success, issues a signed cryptographic `verificationProof` token.

### Insurance Applications (`/api/applications`)
- `POST /api/applications/submit` — Validates customer details, verifies server-side OTP proof, creates application record, saves to MongoDB, and triggers Brevo notification emails.
- `GET /api/applications` — Retrieves all applications with filtering by category and status, plus live dashboard metrics.
- `PATCH /api/applications/:id/status` — Updates application status (`Pending`, `Under Review`, `Contacted`, `Completed`, `Rejected`).

### Callback Request (`/api/callback`)
- `POST /api/callback` — Saves customer callback requests from website footer and sends admin email alert.

---

## 4. Environment Variables

### Client (`client/.env`)
```env
# Leave empty to use local Vite proxy or Vercel serverless routing
VITE_API_BASE_URL=

# Web3Forms API Key for callback form
VITE_WEB3FORMS_ACCESS_KEY=2741f35b-765b-4bd6-b8aa-0b87a7563f2a
```

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/best_insurance_point?retryWrites=true&w=majority

# Brevo Transactional Email API (https://app.brevo.com/settings/keys/api)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=bestinsurance.pmk@gmail.com
BREVO_SENDER_NAME=THE BEST INSURANCE POINT
ADMIN_NOTIFICATION_EMAIL=bestinsurance.pmk@gmail.com

# Real SMS OTP Gateway (Configure at least one)
# 1. 2Factor.in (Recommended for instant Indian OTP)
TWOFACTOR_API_KEY=your_2factor_key_here

# 2. MSG91
MSG91_AUTH_KEY=
MSG91_TEMPLATE_ID=

# 3. Fast2SMS
SMS_PROVIDER_API_KEY=
SMS_PROVIDER_SENDER_ID=

# Cryptographic Token Secret
OTP_SECRET=bip_secure_insurance_otp_secret_2026_x87b
```

---

## 5. Vercel Deployment Instructions

1. Push your repository to GitHub / GitLab.
2. In your Vercel Dashboard, click **Add New Project** and import the repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/dist`
4. In **Project Settings → Environment Variables**, add your backend environment variables (`MONGODB_URI`, `BREVO_API_KEY`, `TWOFACTOR_API_KEY`, `OTP_SECRET`).
5. Click **Deploy**. Vercel will build the frontend into `client/dist` and deploy the Express API via `api/index.js` as serverless functions.
