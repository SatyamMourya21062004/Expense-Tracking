# Expense Tracker Backend - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "currency": "USD"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Refresh Token
**POST** `/auth/refresh`

Request:
```json
{
  "refreshToken": "refresh_token"
}
```

### Get Current User
**GET** `/auth/me` (Protected)

### Update Profile
**PUT** `/auth/update-profile` (Protected)

Request:
```json
{
  "name": "Jane Doe",
  "currency": "EUR"
}
```

---

## Transaction Endpoints

### Get Transactions
**GET** `/transactions` (Protected)

Query Parameters:
- `startDate` - ISO date string
- `endDate` - ISO date string
- `category` - Category ID
- `type` - "income" or "expense"
- `page` - Default: 1
- `limit` - Default: 20 (Max: 100)
- `sortBy` - Default: "date"

### Create Transaction
**POST** `/transactions` (Protected)

Request:
```json
{
  "category": "category_id",
  "type": "expense",
  "amount": 50.00,
  "description": "Lunch",
  "date": "2024-01-15T12:00:00Z",
  "paymentMethod": "cash"
}
```

### Get Single Transaction
**GET** `/transactions/:id` (Protected)

### Update Transaction
**PUT** `/transactions/:id` (Protected)

### Delete Transaction
**DELETE** `/transactions/:id` (Protected)

---

## Category Endpoints

### Get Categories
**GET** `/categories` (Protected)

Query Parameters:
- `type` - "income" or "expense" (optional)

### Create Category
**POST** `/categories` (Protected)

Request:
```json
{
  "name": "Groceries",
  "type": "expense",
  "color": "#FF6B6B",
  "icon": "shopping-bag",
  "description": "Grocery shopping"
}
```

### Update Category
**PUT** `/categories/:id` (Protected)

### Delete Category
**DELETE** `/categories/:id` (Protected)

---

## Budget Endpoints

### Get Budgets
**GET** `/budgets` (Protected)

### Create Budget
**POST** `/budgets` (Protected)

Request:
```json
{
  "category": "category_id",
  "amount": 500.00,
  "period": "monthly",
  "alertThreshold": 80,
  "description": "Monthly budget for groceries"
}
```

### Update Budget
**PUT** `/budgets/:id` (Protected)

### Delete Budget
**DELETE** `/budgets/:id` (Protected)

---

## Analytics Endpoints

### Get Summary
**GET** `/analytics/summary` (Protected)

Query Parameters:
- `period` - "monthly" or "yearly"

Response:
```json
{
  "success": true,
  "period": "monthly",
  "data": {
    "income": 3000,
    "expense": 1500,
    "balance": 1500,
    "incomeCount": 2,
    "expenseCount": 15
  }
}
```

### Get Category Breakdown
**GET** `/analytics/category-breakdown` (Protected)

Query Parameters:
- `type` - "income" or "expense" (optional)
- `month` - 1-12 (optional)
- `year` - YYYY (optional)

### Get Trends
**GET** `/analytics/trends` (Protected)

Query Parameters:
- `months` - Number of months to include (default: 12)

Response:
```json
{
  "success": true,
  "months": 12,
  "data": [
    {
      "month": "2024-01",
      "income": 3000,
      "expense": 1500
    },
    ...
  ]
}
```

### Get Budget vs Actual
**GET** `/analytics/budget-vs-actual` (Protected)

Query Parameters:
- `month` - 1-12 (optional)
- `year` - YYYY (optional)

Response:
```json
{
  "success": true,
  "month": 1,
  "year": 2024,
  "data": [
    {
      "id": "budget_id",
      "categoryId": "category_id",
      "categoryName": "Groceries",
      "budgeted": 500,
      "actual": 420,
      "remaining": 80,
      "percentUsed": 84,
      "exceeded": false,
      "alertThreshold": 80,
      "shouldAlert": true
    }
  ]
}
```

---

## Error Responses

All errors return appropriate HTTP status codes:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication error)
- `403` - Forbidden (authorization error)
- `404` - Not Found
- `500` - Server Error
