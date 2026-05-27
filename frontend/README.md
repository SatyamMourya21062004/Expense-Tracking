# Expense Tracker Frontend - README

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Configure API URL in .env
VITE_API_URL=http://localhost:5000/api

# 4. Start development server
npm run dev

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js          # Axios instance with interceptors
│   │   └── services.js       # API service functions
│   ├── components/
│   │   ├── Header.jsx        # Main header component
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   ├── CategoryBreakdownChart.jsx
│   │   ├── TrendsChart.jsx
│   │   └── BudgetVsActualChart.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── TransactionsPage.jsx
│   ├── store/
│   │   └── index.js          # Zustand store
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── globals.css           # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .gitignore

## Key Features

### Authentication
- User registration and login
- JWT-based token management
- Automatic token refresh
- Persistent authentication using localStorage

### Dashboard
- Summary cards showing income, expenses, balance, and saving rate
- Category breakdown pie chart
- Monthly/yearly trends visualization
- Budget vs actual spending comparison

### Transaction Management
- Create, read, update, and delete transactions
- Filter by type (income/expense)
- Categorize transactions
- Record payment methods and dates

### Analytics
- Visualize spending by category
- Track income/expense trends over time
- Monitor budget adherence
- Calculate saving rates

## API Integration

All API calls are made through the Axios instance in `src/api/axios.js` with:
- Automatic Bearer token injection
- Token refresh on 401 errors
- Error handling and logging

## Styling

- **Framework**: Tailwind CSS
- **Design System**: CSS custom properties for theme colors
- **Colors**: Dark mode theme with primary blue accent
- **Components**: Recharts for visualizations

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Deployment Options

1. **Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**:
   - Connect GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Docker**:
   Create a Dockerfile for containerized deployment

## Development

### Running the dev server

```bash
npm run dev
```

Server starts on http://localhost:5173

### Code Quality

- Use ESLint for code linting
- Format code with Prettier
- Follow React best practices
- Use functional components with hooks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Issues
- Ensure backend server is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS settings on backend

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration
- Verify JWT secrets match between frontend/backend

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist .vite`
- Update dependencies: `npm update`
