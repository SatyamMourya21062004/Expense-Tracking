# Expense Tracker Application - Complete Setup Guide

A full-stack expense tracking application with React + Vite frontend, Express.js backend, and MongoDB database.

## Project Architecture

```
expense-tracker/
├── frontend/              # React + Vite application
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
└── backend/              # Express.js API server
    ├── src/
    ├── server.js
    ├── package.json
    └── ...
```

## Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Git** (for version control)

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB credentials
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
# JWT_SECRET=your_secret_key_here
# JWT_REFRESH_SECRET=your_refresh_secret_key
# FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Create a database user
5. Get connection string
6. Update `.env` file in backend with connection string

Format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

## Features

### Authentication
- ✓ User registration and login
- ✓ JWT token-based authentication
- ✓ Password hashing with bcryptjs
- ✓ Token refresh mechanism
- ✓ Secure session management

### Transaction Management
- ✓ Create, read, update, delete transactions
- ✓ Categorize income and expenses
- ✓ Track payment methods
- ✓ Add descriptions and tags
- ✓ Filter by date range and category

### Analytics & Reporting
- ✓ Monthly and yearly summaries
- ✓ Category-wise breakdown (pie charts)
- ✓ Income/expense trends (line/bar charts)
- ✓ Budget vs actual comparison
- ✓ Saving rate calculation

### Budget Management
- ✓ Set budgets per category
- ✓ Set alert thresholds
- ✓ Track budget usage
- ✓ Get budget warnings

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/refresh         - Refresh access token
GET    /api/auth/me              - Get current user
PUT    /api/auth/update-profile  - Update user profile
POST   /api/auth/logout          - Logout
```

### Transactions
```
GET    /api/transactions         - Get all transactions (paginated)
POST   /api/transactions         - Create transaction
GET    /api/transactions/:id     - Get single transaction
PUT    /api/transactions/:id     - Update transaction
DELETE /api/transactions/:id     - Delete transaction
```

### Categories
```
GET    /api/categories           - Get all categories
POST   /api/categories           - Create category
GET    /api/categories/:id       - Get single category
PUT    /api/categories/:id       - Update category
DELETE /api/categories/:id       - Delete category
```

### Budgets
```
GET    /api/budgets              - Get all budgets
POST   /api/budgets              - Create budget
GET    /api/budgets/:id          - Get single budget
PUT    /api/budgets/:id          - Update budget
DELETE /api/budgets/:id          - Delete budget
```

### Analytics
```
GET    /api/analytics/summary             - Monthly/yearly summary
GET    /api/analytics/category-breakdown  - Expenses by category
GET    /api/analytics/trends              - Income/expense trends
GET    /api/analytics/budget-vs-actual    - Budget comparison
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  currency: String (default: USD),
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
  type: "income" | "expense",
  amount: Number,
  description: String,
  date: Date,
  paymentMethod: "cash" | "credit_card" | "debit_card" | "bank_transfer" | "other",
  tags: [String],
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
  type: "income" | "expense",
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
  period: "daily" | "weekly" | "monthly" | "yearly",
  startDate: Date,
  endDate: Date,
  alertThreshold: Number (0-100),
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Expense Tracker
```

## Production Deployment

### Backend (Heroku/Railway/Render)

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app**
```bash
cd backend
heroku create your-app-name
```

3. **Set environment variables**
```bash
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

4. **Deploy**
```bash
git push heroku main
```

### Frontend (Vercel/Netlify)

#### Vercel
```bash
npm install -g vercel
cd frontend
vercel
```

Update VITE_API_URL in Vercel project settings to production API URL.

#### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your_production_api_url`

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused

### Best Practices
- Always validate user input
- Use environment variables for sensitive data
- Implement proper error handling
- Add logging for debugging
- Use HTTPS in production

### Testing

Backend:
```bash
# Run tests (if configured)
npm test
```

Frontend:
```bash
# Run tests
npm run test
```

## Troubleshooting

### Backend Issues

**MongoDB connection error**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

**Port already in use**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

**Token errors**
- Verify JWT secrets match
- Check token expiration times
- Clear and re-login

### Frontend Issues

**API not responding**
- Check backend is running
- Verify API URL in .env
- Check CORS configuration
- Verify network tab in DevTools

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Project Features Checklist

- [x] User authentication (register/login)
- [x] JWT token management
- [x] Transaction CRUD operations
- [x] Category management
- [x] Budget tracking
- [x] Monthly/yearly summaries
- [x] Category breakdown charts
- [x] Income/expense trends
- [x] Budget vs actual comparison
- [x] Pagination and filtering
- [x] Input validation
- [x] Error handling
- [x] Protected routes
- [x] Responsive design
- [x] Dark theme UI

## Security Features

- ✓ Password hashing (bcryptjs)
- ✓ JWT token authentication
- ✓ HTTP-only cookies ready
- ✓ CORS configuration
- ✓ Input validation and sanitization
- ✓ SQL injection prevention (MongoDB)
- ✓ Rate limiting ready
- ✓ Environment variable protection

## Performance Optimization

- Pagination for large datasets
- Database indexing
- Lazy loading components
- Code splitting with Vite
- Image optimization
- Caching strategies
- Query optimization with aggregation pipelines

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Recharts Documentation](https://recharts.org/)

## Support & Contributing

For issues or feature requests, create an issue in the repository.

## License

MIT License - feel free to use this project for personal or commercial use.

## Next Steps

1. Set up MongoDB Atlas
2. Clone or download the project
3. Follow the Quick Start guide above
4. Create default categories for users
5. Add more features as needed
6. Deploy to production when ready
