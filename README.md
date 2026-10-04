# 👕 Clothing Exchange & Swap Marketplace

A full-stack web application that enables users to exchange and swap clothing items without monetary transactions. Users can list their clothes, discover items from other users, send swap requests, communicate through chat, and complete exchanges.

The platform also provides an administrative dashboard for managing users, clothing listings, and swap requests.

---

## 🌐 Live Demo

### Frontend
https://clothing-swap-marketplace-om9o.vercel.app/

### Backend API
https://clothing-swap-marketplace-yo4u.onrender.com

### GitHub Repository
https://github.com/shiva2005-maker/clothing-swap-marketplace

---

## 📌 Project Overview

The **Clothing Exchange & Swap Marketplace** is designed to promote sustainable fashion by allowing users to exchange clothes instead of purchasing new ones.

# SwapWear — Clothing Swap Marketplace

SwapWear is a web application for listing pre-loved clothing and arranging swaps with other users. Members can browse listings, manage their own items, request swaps, and chat about a swap. Administrators can manage users, listings, and swap requests.

## Features

- Register and sign in as a customer
- Browse clothing listings and view item details
- Create, edit, and manage clothing listings with up to five images
- Send and manage swap requests
- Chat in real time about swaps
- Edit a profile, including profile image and location
- Admin dashboard for managing users, clothing listings, and swaps

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT and bcrypt

## Requirements

- Node.js compatible with Vite 8 (Node.js 20.19+ or 22.12+)
- npm
- A MongoDB database, local or hosted

## Run locally

Clone the repository, then install and start the backend:

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/clothing_swap_marketplace
JWT_KEY=replace-with-a-long-random-secret
port=5000
```

Start the API and Socket.IO server:

```bash
node index.js
```

In a second terminal, configure and start the frontend:

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then run the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

> **Local CORS setup:** The backend currently allows the deployed frontend origin only. To use the local Vite frontend, update the allowed origin in both the Express CORS configuration and the Socket.IO CORS configuration in `Backend/index.js` to match your local frontend URL.

## Admin access

The app does **not** automatically seed an administrator account. Public registration always creates a `customer`, so simply registering with an admin email will not grant admin access.

To create a local demo administrator:

1. Register through the app with the email `admin@gmail.com` and a password you choose. Registration also requires a name and phone number.
2. In `mongosh`, connect to the same database configured by `MONGODB_URL` and promote that user:

   ```javascript
   db.users.updateOne(
     { email: "admin@gmail.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Sign out and sign back in, then open `/admin`.

Use only a disposable password for local demos. Do not publish admin passwords in this repository or use demo credentials in production. For a production admin account, set a unique strong password and provision access securely.

## Available scripts

Run these from `Frontend/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the frontend for production
npm run preview  # Preview the production build locally
npm run lint     # Lint the frontend
```

The backend currently has no start script; start it from `Backend/` with `node index.js`.

Users can:

- Create an account and securely log in
- Manage their profile and location
- Add clothing items for exchange
- Browse clothing listed by other users
- Search and filter clothing
- View detailed clothing information
- Send swap requests
- Accept, reject, or cancel swap requests
- Communicate with swap participants through chat
- Mark completed swaps
- Track their listings and swap activity

Administrators can:

- View dashboard statistics
- Manage users
- Activate/deactivate users
- Delete users
- Manage clothing listings
- Change clothing status
- Delete inappropriate listings
- Monitor swap requests
- Update swap statuses

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- HTTP-only authentication cookies
- Protected routes
- Role-based authorization
- Customer and Admin roles
- Secure admin-only routes
- Logout functionality

---

### 👨‍💼 User Profile

Users can manage:

- Name
- Email
- Phone number
- Profile image
- Location

Location information is converted into geographical coordinates using geocoding.

---

### 👕 Clothing Management

Users can create and manage clothing listings.

Each listing can contain:

- Title
- Description
- Category
- Sub-category
- Brand
- Size
- Gender
- Condition
- Color
- Estimated value
- Images
- Location
- Clothing status

Supported clothing categories include:

- T-Shirts
- Shirts
- Jeans
- Trousers
- Jackets
- Dresses
- Skirts
- Sweaters
- Hoodies
- Shoes
- Accessories
- Other

---

### 🔎 Marketplace

The marketplace allows users to discover clothing available for swapping.

Features include:

- Search
- Category filtering
- Size filtering
- Gender filtering
- Condition filtering
- Location information
- Clothing status
- Detailed clothing view
- User's own listings hidden from marketplace results

---

### 🔄 Swap Request System

Users can send swap requests by selecting:

- Clothing item they want
- Their clothing item to offer
- Optional message

Swap requests support:

- Pending
- Accepted
- Rejected
- Cancelled
- Completed

The system also prevents:

- Requesting your own clothing
- Offering another user's clothing
- Duplicate pending swap requests
- Swapping unavailable items

---

### 💬 Real-Time Chat

After a swap request is accepted, participants can communicate through chat.

The chat system supports:

- Swap-specific conversations
- Message history
- Sender and receiver information
- Real-time messaging using Socket.IO
- Chat access restricted to accepted swaps

---

### ✅ Complete Swap

After the physical exchange is completed, a participant can mark the swap as completed.

When a swap is completed:

```text
Swap Request
     ↓
Completed

Requested Clothing
     ↓
Swapped

Offered Clothing
     ↓
Swapped
