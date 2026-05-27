# Expense Tracker - Full Stack Application

A professional, production-ready expense tracking application built with **React + Vite**, **Node.js + Express**, and **MongoDB**. Manage your income and expenses with powerful analytics and budget tracking features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Features
- **User Authentication**: Secure registration, login, and JWT-based session management
- **Income & Expense Tracking**: Full CRUD operations with categorization
- **Category Management**: Create custom categories for income and expenses
- **Budget Planning**: Set budgets per category with customizable alert thresholds
- **Monthly & Yearly Summaries**: Comprehensive financial overviews

### Analytics & Visualization
- **Category Breakdown**: Pie charts showing expense distribution by category
- **Income vs Expense Trends**: Bar charts tracking financial patterns over time
- **Budget vs Actual Comparison**: Monitor budget adherence with visual progress bars
- **Saving Rate Calculation**: Automatic calculation of savings percentage
- **Financial Dashboard**: Real-time overview of key metrics

### Technical Features
- Secure and optimized REST APIs
- Pagination and filtering capabilities
- Input validation and error handling
- Responsive design for all devices
- Dark theme UI with modern aesthetics
- Automatic token refresh mechanism

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library with hooks
- **Vite** - Ultra-fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Zustand** - Lightweight state management
- **Recharts** - React charting library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **MongoDB 7.0** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### DevOps & Tools
- **MongoDB Atlas** - Cloud database
- **Vite** - Development and build tooling
- **nodemon** - Development server auto-reload
- **Git** - Version control

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Transaction.js        # Transaction schema
│   │   │   ├── Category.js           # Category schema
│   │   │   └── Budget.js             # Budget schema
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── transactionController.js
│   │   │   ├── categoryController.js
│   │   │   ├── budgetController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── auth.js               # Auth endpoints
│   │   │   ├── transactions.js       # Transaction endpoints
│   │   │   ├── categories.js         # Category endpoints
│   │   │   ├── budgets.js            # Budget endpoints
│   │   │   └── analytics.js          # Analytics endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── validation.js         # Input validation
│   │   │   └── errorHandler.js       # Error handling
│   │   └── app.js                    # Express app setup
│   ├── server.js                     # Entry point
│   ├── package.json
│   ├── .env.example
│   └── API_DOCUMENTATION.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js              # Axios configuration
│   │   │   └── services.js           # API service functions
│   │   ├── components/
│   │   │   ├── Header.jsx            # Main header
│   │   │   ├── ProtectedRoute.jsx    # Route protection
│   │   │   ├── CategoryBreakdownChart.jsx
│   │   │   ├── TrendsChart.jsx
│   │   │   └── BudgetVsActualChart.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── TransactionsPage.jsx
│   │   ├── store/
│   │   │   └── index.js              # Zustand stores
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── globals.css               # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
│
├── SETUP_GUIDE.md                    # Comprehensive setup guide
├── BACKEND_SETUP.md                  # Backend-specific guide
└── README.md                          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB Atlas account (free tier)
- Terminal/Command prompt

### Installation (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd expense-tracker

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB connection string and JWT secrets
npm run dev

# 3. Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env
# Keep VITE_API_URL=http://localhost:5000/api
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 🔧 Backend Setup

### Detailed Setup Instructions

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure .env with:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
```

### Database Initialization

Default categories will be created automatically on first transaction. To seed the database:

```javascript
// Add this to a seed script
const defaultCategories = [
  { type: 'expense', name: 'Food', icon: 'utensils' },
  { type: 'expense', name: 'Transport', icon: 'car' },
  { type: 'expense', name: 'Entertainment', icon: 'music' },
  { type: 'income', name: 'Salary', icon: 'briefcase' },
  { type: 'income', name: 'Freelance', icon: 'code' },
];
```

## 🎨 Frontend Setup

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configuration
VITE_API_URL=http://localhost:5000/api

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Lint code (if configured)
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

```bash
# Register
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

# Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}

# Refresh Token
POST /auth/refresh
{
  "refreshToken": "refresh_token_here"
}

# Get Current User
GET /auth/me
Headers: Authorization: Bearer <access_token>
```

### Transaction Endpoints

```bash
# List transactions
GET /transactions?page=1&limit=20&type=expense&category=cat_id&startDate=2024-01-01

# Create transaction
POST /transactions
{
  "category": "category_id",
  "type": "expense",
  "amount": 50.00,
  "description": "Lunch",
  "date": "2024-01-15",
  "paymentMethod": "cash"
}

# Update transaction
PUT /transactions/:id
{ /* same fields as create */ }

# Delete transaction
DELETE /transactions/:id
```

### Analytics Endpoints

```bash
# Monthly summary
GET /analytics/summary?period=monthly

# Category breakdown
GET /analytics/category-breakdown?type=expense&month=1&year=2024

# Trends (12 months)
GET /analytics/trends?months=12

# Budget vs actual
GET /analytics/budget-vs-actual?month=1&year=2024
```

### Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  currency: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  type: String enum('income', 'expense'),
  amount: Number,
  description: String,
  date: Date,
  paymentMethod: String,
  tags: [String],
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  name: String,
  type: String enum('income', 'expense'),
  color: String (hex),
  icon: String,
  description: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  amount: Number,
  period: String enum('daily', 'weekly', 'monthly', 'yearly'),
  startDate: Date,
  endDate: Date,
  alertThreshold: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Deployment

### Backend Deployment (Heroku/Railway)

```bash
# Deploy to Heroku
heroku create your-app-name
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment: `VITE_API_URL=https://your-backend.com/api`

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/expense_tracker
JWT_SECRET=your_jwt_secret_key_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Expense Tracker
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
✗ Verify connection string format
✗ Check IP whitelist in MongoDB Atlas
✗ Ensure database name is correct
```

### API Not Connecting
```
✗ Backend running on port 5000?
✗ VITE_API_URL correct in frontend .env?
✗ CORS enabled on backend?
```

### Build Failures
```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
kill -9 <PID>
```

## 📝 Key Implementation Details

### Security
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 15-minute expiration
- Refresh tokens with 7-day expiration
- CORS restricted to frontend URL
- Input validation on all endpoints
- Error messages don't leak sensitive data

### Performance
- Database indexing on frequently queried fields
- Pagination for large datasets (default 20 items)
- Aggregation pipelines for analytics queries
- Lazy loading components
- Code splitting with Vite

### Code Quality
- Modular architecture with separation of concerns
- Reusable components and services
- Error handling with try-catch
- Consistent naming conventions
- Clean and commented code

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🎉 Getting Started Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB Atlas account created
- [ ] Repository cloned
- [ ] Backend .env configured
- [ ] Backend running (npm run dev)
- [ ] Frontend .env configured
- [ ] Frontend running (npm run dev)
- [ ] Can login at http://localhost:5173
- [ ] Can create transactions
- [ ] Can view analytics dashboard

---

**Happy expense tracking! 💰**
