# 💰 Expense Tracker

A modern and user-friendly Expense Tracking Application that helps users manage their daily income and expenses efficiently. It provides an easy way to record transactions, monitor spending habits, and maintain financial discipline.

---

## 📌 Features

- ➕ Add Income and Expense transactions
- ✏️ Edit existing transactions
- ❌ Delete transactions
- 📊 Real-time balance calculation
- 💵 Track total income and total expenses
- 📅 Transaction history
- 📱 Responsive design for desktop and mobile
- ⚡ Fast and simple user interface

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

## 📊 Database Schema

### Users

| Field | Type |
|---------|------|
| id | INT |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |

### Transactions

| Field | Type |
|---------|------|
| id | INT |
| user_id | INT |
| amount | DECIMAL |
| type | ENUM (Income, Expense) |
| category | VARCHAR |
| description | TEXT |
| date | DATE |

---

## 🎯 Future Improvements

- User Authentication
- Monthly Reports
- Expense Categories
- Budget Planning
- Charts and Analytics
- Export to PDF
- Dark Mode
- Currency Selection
- Email Notifications

---
