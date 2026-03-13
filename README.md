# BoostNaija - Production SMM Reseller Platform

BoostNaija is a futuristic SMM reseller platform built specifically for the Nigerian market. It integrates with **SMM.com.ng** and supports automated payments via **Paystack** and **Flutterwave**.

## Features
- 🚀 **Futuristic UI**: Modern dark theme with neon green accents and smooth Framer Motion animations.
- 💳 **Automated Payments**: Instant wallet funding via Paystack and Flutterwave webhooks.
- 📦 **API Integration**: Real-time service fetching and order placement via SMM.com.ng.
- 🔐 **Secure**: JWT authentication, rate limiting, and input validation.
- 👨‍💼 **Admin Panel**: Manage users, adjust balances, sync services, and view analytics.

## Tech Stack
- **Frontend**: React, TailwindCSS, Framer Motion, Axios, Recharts.
- **Backend**: Node.js, Express, MongoDB, JWT.
- **Gateways**: Paystack, Flutterwave.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB URI (Atlas recommended)
- API Keys for SMM.com.ng, Paystack, and Flutterwave

### 2. Backend Setup
1. Navigate to `/server`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PAYSTACK_SECRET_KEY=sk_test_...
   FLUTTERWAVE_SECRET_KEY=FLWSECK_...
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_...
   SMM_API_KEY=your_smm_api_key
   ```
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Navigate to `/client`.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend: `npm run dev`.

## Deployment

### Backend (Render/Heroku)
- Set Environment Variables on the platform dashboard.
- Set `NODE_ENV` to `production`.
- Ensure the `MONGO_URI` is accessible.

### Frontend (Vercel/Netlify)
- Set `VITE_API_URL` to your deployed backend URL.
- Build command: `npm run build`.
- Output directory: `dist`.

## Create Admin User
To access the admin panel (`/admin`), manually change a user's role to `admin` in your MongoDB collection after they register.

---
Built with ❤️ for BoostNaija.
