# Quick Reference - Expense Tracker

## 🚀 5-Minute Setup

### Step 1: Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: Add MongoDB URI
npm run dev
```

### Step 2: Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Step 3: Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

---

## 📋 MongoDB Atlas Setup

1. Visit mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster
4. Create database user
5. Get connection string
6. Paste into backend/.env as MONGODB_URI

Format: `mongodb+srv://user:pass@cluster.mongodb.net/expense_tracker`

---

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🗂️ Project Layout

```
backend/          - Express API server (port 5000)
  ├── src/
  │   ├── models/      - MongoDB schemas
  │   ├── controllers/ - Business logic
  │   ├── routes/      - API endpoints
  │   └── middleware/  - Auth, validation
  └── server.js        - Entry point

frontend/         - React app (port 5173)
  ├── src/
  │   ├── pages/       - Full pages
  │   ├── components/  - Reusable components
  │   ├── api/         - API calls
  │   └── store/       - State management
  └── main.jsx         - Entry point
```

---

## 📡 API Quick Reference

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Categories
```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Analytics
```
GET    /api/analytics/summary
GET    /api/analytics/category-breakdown
GET    /api/analytics/trends
GET    /api/analytics/budget-vs-actual
```

---

## 💡 Common Commands

### Backend
```bash
npm run dev          # Start dev server
npm start            # Start production
npm test             # Run tests
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Check code
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -i :5000    # Check port
kill -9 <PID>    # Kill process
```

### MongoDB Connection Failed
- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### API Not Connecting
- Ensure backend is running
- Check VITE_API_URL in frontend/.env
- Verify CORS settings

### Build Error
```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📊 Key Features

✓ User authentication
✓ Transaction tracking
✓ Category management
✓ Budget tracking
✓ Advanced analytics
✓ Pie charts
✓ Trend charts
✓ Budget comparisons
✓ Responsive design
✓ Dark theme

---

## 🎯 First Steps

1. **Register** - Create new account
2. **Add Categories** - Income/Expense types
3. **Add Transactions** - Track spending
4. **Set Budgets** - Create budget limits
5. **View Analytics** - Check dashboard
6. **Monitor Trends** - Track patterns

---

## 📚 Documentation

- `README.md` - Main overview
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_SUMMARY.md` - Feature summary
- `backend/API_DOCUMENTATION.md` - API details
- `frontend/README.md` - Frontend guide

---

## 🚢 Deployment

### Backend (Heroku)
```bash
heroku create app-name
git push heroku main
heroku config:set MONGODB_URI=...
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

---

## 📞 Quick Help

**Q: How to add categories?**
A: Navigate to Transactions page, create category when adding transaction

**Q: How to reset password?**
A: Currently no reset - use browser's password manager or create new account

**Q: How to export data?**
A: Access MongoDB Atlas to export collections

**Q: How to backup data?**
A: Use MongoDB Atlas backup features or export to JSON

---

## 🔐 Security Tips

- Keep JWT secrets secure
- Use HTTPS in production
- Validate all inputs
- Regular database backups
- Monitor access logs
- Update dependencies regularly

---

## 📱 Supported Browsers

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

**Ready to get started? Run `npm install && npm run dev` in both folders!**
