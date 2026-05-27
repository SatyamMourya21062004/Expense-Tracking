# Expense Tracker Backend Setup Guide

This guide provides instructions for setting up the Express.js backend with MongoDB.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation Steps

```bash
# 1. Create backend directory
mkdir expense-tracker-backend
cd expense-tracker-backend

# 2. Initialize Node project
npm init -y

# 3. Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator helmet

# Development dependencies
npm install --save-dev nodemon

# 4. Create folder structure (see below)

# 5. Create .env file with your MongoDB credentials
# Add the following:
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5000
NODE_ENV=development

# 6. Start development server
npm run dev
```

## Backend Folder Structure

```
expense-tracker-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Category.js
│   │   └── Budget.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── categoryController.js
│   │   ├── budgetController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   ├── categories.js
│   │   ├── budgets.js
│   │   └── analytics.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js
│   │   └── validation.js        # Input validation
│   ├── services/
│   │   ├── analyticsService.js  # Data aggregation logic
│   │   └── transactionService.js
│   └── app.js                    # Express app setup
├── .env
├── .gitignore
├── package.json
└── server.js                     # Entry point

## API Endpoints Summary

**Auth Routes** (POST):
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

**Transaction Routes**:
- GET /api/transactions (with filters)
- POST /api/transactions
- GET /api/transactions/:id
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

**Category Routes**:
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

**Budget Routes**:
- GET /api/budgets
- POST /api/budgets
- PUT /api/budgets/:id
- DELETE /api/budgets/:id

**Analytics Routes**:
- GET /api/analytics/summary (monthly/yearly)
- GET /api/analytics/category-breakdown
- GET /api/analytics/trends
- GET /api/analytics/budget-vs-actual

## Database Connection
MongoDB collections will be auto-created on first insert. Ensure proper indexes are created for performance.

## Security Considerations
- All passwords hashed with bcryptjs
- JWT tokens with configurable expiration
- Input validation on all endpoints
- CORS configured
- Rate limiting recommended for production
- Environment variables for sensitive data
```

Now let me create all the backend files:
