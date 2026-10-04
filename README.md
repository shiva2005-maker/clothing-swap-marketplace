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
