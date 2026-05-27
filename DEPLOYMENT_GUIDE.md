# Deployment Checklist & Production Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All console.log statements removed
- [ ] No hardcoded credentials or API keys
- [ ] Environment variables configured
- [ ] Error handling in place
- [ ] No sensitive data in code
- [ ] Code follows project style guide
- [ ] No deprecated libraries used

### Security
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention implemented
- [ ] Password hashing with bcryptjs
- [ ] JWT secrets changed from defaults
- [ ] No JWT secrets in frontend code
- [ ] Headers security (Helmet) enabled

### Testing
- [ ] Backend API endpoints tested
- [ ] Frontend pages load without errors
- [ ] Authentication flow works
- [ ] Transactions CRUD tested
- [ ] Charts render correctly
- [ ] Responsive design verified
- [ ] Mobile testing completed
- [ ] Cross-browser testing done

### Performance
- [ ] Database queries optimized
- [ ] Indexes created on frequently queried fields
- [ ] Pagination implemented
- [ ] Code splitting enabled (Vite)
- [ ] Images optimized
- [ ] Caching strategy in place
- [ ] Bundle size analyzed

### Documentation
- [ ] README.md completed
- [ ] API documentation updated
- [ ] Deployment guide written
- [ ] Setup instructions clear
- [ ] Environment variables documented
- [ ] Troubleshooting guide included
- [ ] Comments added to complex code

---

## Backend Deployment

### Prepare Backend

```bash
# 1. Clean up code
- Remove all console.log statements
- Remove debug code
- Update error messages

# 2. Optimize database
- Create indexes on all queries
- Review slow queries
- Update aggregation pipelines

# 3. Environment setup
- Change JWT secrets
- Update MongoDB connection
- Set NODE_ENV=production
```

### Deploy to Heroku

```bash
# 1. Create Heroku account
# Visit: https://www.heroku.com

# 2. Install Heroku CLI
npm install -g heroku
heroku login

# 3. Create app
cd backend
heroku create your-app-name

# 4. Add buildpack
heroku buildpacks:add heroku/nodejs

# 5. Set environment variables
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_production_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=your_frontend_url

# 6. Deploy
git push heroku main

# 7. Monitor logs
heroku logs --tail

# 8. Open app
heroku open
```

### Deploy to Railway

```bash
# 1. Create Railway account
# Visit: https://railway.app

# 2. Connect GitHub repository
# Add service -> GitHub

# 3. Configure environment
- Add MONGODB_URI
- Add JWT_SECRET
- Add JWT_REFRESH_SECRET
- Add NODE_ENV=production

# 4. Deploy
Automatic on push to main

# 5. Get production URL
View in Railway dashboard
```

### Deploy to Render

```bash
# 1. Create Render account
# Visit: https://render.com

# 2. Create Web Service
- GitHub repository
- Build command: npm install
- Start command: npm start

# 3. Set environment variables
Add in Render dashboard

# 4. Deploy
Automatic on push

# 5. Get production URL
https://your-app.onrender.com
```

---

## Frontend Deployment

### Prepare Frontend

```bash
# 1. Update environment
VITE_API_URL=https://your-backend.com/api

# 2. Build for production
npm run build

# 3. Test build locally
npm run preview

# 4. Check performance
npm run build -- --report
```

### Deploy to Vercel

```bash
# 1. Create Vercel account
# Visit: https://vercel.com

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
cd frontend
vercel

# 4. Configure project
- Framework: Vite
- Root directory: .
- Build command: npm run build
- Output directory: dist

# 5. Set environment variable
- VITE_API_URL: https://your-backend.com/api

# 6. Deploy
Automatic on push or manual trigger
```

### Deploy to Netlify

```bash
# 1. Create Netlify account
# Visit: https://netlify.com

# 2. Connect GitHub repository
- New site from Git
- Select GitHub
- Choose repository

# 3. Configure build
- Build command: npm run build
- Publish directory: dist

# 4. Set environment variable
- VITE_API_URL: https://your-backend.com/api

# 5. Deploy
Automatic on push

# 6. Configure redirects
Add netlify.toml:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy to GitHub Pages

```bash
# 1. Update vite.config.js
export default {
  base: '/expense-tracker/',
  ...
}

# 2. Build
npm run build

# 3. Deploy gh-pages package
npm install -D gh-pages

# 4. Add deploy script to package.json
"deploy": "gh-pages -d dist"

# 5. Deploy
npm run deploy
```

---

## Database (MongoDB Atlas)

### Production Setup

```
1. Create MongoDB Atlas account
2. Create M0 (free) or M2 cluster for small apps
3. Create admin user with strong password
4. Set IP whitelist to application IPs
5. Create specific database user (not admin)
6. Enable backup
7. Monitor performance
```

### Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

### Backup Strategy

```
MongoDB Atlas:
- Enable daily backups
- Keep 7-day backup retention
- Test restore process monthly
- Export important data quarterly
```

---

## Post-Deployment

### Verification Checklist

- [ ] Backend API responds
- [ ] Frontend loads
- [ ] Login/register works
- [ ] Can create transaction
- [ ] Can view dashboard
- [ ] Charts render
- [ ] Database connection verified
- [ ] No error logs
- [ ] Performance acceptable

### Monitoring

```bash
# Backend monitoring
- Check Heroku/Railway logs
- Monitor error rates
- Track database performance
- Set up alerting

# Frontend monitoring
- Check Vercel analytics
- Monitor error tracking
- Track performance metrics
- Set up uptime monitoring
```

### Maintenance

```
Daily:
- Check error logs
- Verify uptime

Weekly:
- Review performance metrics
- Check database size

Monthly:
- Backup database
- Update dependencies
- Review security logs
- Analyze usage patterns

Quarterly:
- Full security audit
- Performance optimization
- Dependency updates
```

---

## Performance Optimization

### Backend Optimization

```javascript
// 1. Enable compression
app.use(compression());

// 2. Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// 3. Database indexing
// Check MongoDB indexes

// 4. Pagination
GET /api/transactions?page=1&limit=20
```

### Frontend Optimization

```bash
# 1. Code splitting
// Lazy load routes
const Dashboard = lazy(() => import('./pages/DashboardPage'));

# 2. Image optimization
- Use optimized image formats
- Lazy load images

# 3. Bundle analysis
npm run build -- --report

# 4. CSS optimization
- Remove unused styles
- Minify CSS in production
```

---

## Security Hardening

### Before Production

- [ ] Remove debug routes
- [ ] Enable rate limiting
- [ ] Set secure cookies (HttpOnly)
- [ ] Enable HSTS headers
- [ ] Configure CSP headers
- [ ] Remove X-Powered-By header
- [ ] Validate all inputs
- [ ] Sanitize output
- [ ] Use HTTPS only
- [ ] Update dependencies

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### HTTPS Redirect

```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

## Environment Variables Template

### Backend Production (.env)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/expense_tracker
JWT_SECRET=your_production_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_production_refresh_secret_min_32_chars
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
LOG_LEVEL=error
```

### Frontend Production (.env)

```
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Expense Tracker
```

---

## Rollback Plan

### If Deployment Fails

```bash
# Heroku
heroku rollback

# Railway/Render
Revert commit and redeploy

# Netlify/Vercel
Select previous deploy version
```

### Data Recovery

```
MongoDB:
- Use Atlas backup restore
- Or restore from exported JSON
- Always test restore process first
```

---

## Monitoring & Alerts

### Tools to Use

```
Backend:
- Heroku/Railway logs
- Sentry for error tracking
- New Relic for performance
- Datadog for monitoring

Frontend:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for tracking
- Vercel Analytics
```

### Key Metrics to Track

```
Backend:
- Response time
- Error rate
- Database query time
- Memory usage
- CPU usage

Frontend:
- Page load time
- Time to interactive
- Error rate
- User sessions
- Conversion rate
```

---

## Scaling Considerations

### When to Scale

```
Backend:
- If response time > 1 second
- If CPU > 80% consistently
- If memory usage > 90%
- If error rate increases

Frontend:
- If page load > 3 seconds
- If bundle size > 500KB
- If Core Web Vitals degrade
```

### Scaling Options

```
Backend:
- Upgrade Heroku dyno
- Increase Railway compute
- Add caching layer (Redis)
- Optimize queries
- Upgrade database plan

Frontend:
- Use CDN
- Implement Service Worker
- Code splitting
- Lazy loading
- Image optimization
```

---

## Disaster Recovery

### Backup Strategy

```
MongoDB:
- Daily automated backups
- Weekly manual export
- Monthly off-site backup
- Test restore monthly

Code:
- GitHub version control
- Multiple branches
- Tag releases
- Document changes
```

### Recovery Plan

```
If database lost:
1. Restore from MongoDB backup
2. Verify data integrity
3. Run migrations if needed
4. Test before announcing

If code compromised:
1. Review Git history
2. Revert to known good version
3. Rebuild and redeploy
4. Security audit
```

---

## Production Troubleshooting

### Common Issues

```
Issue: API timeout
Solution:
- Check database connection
- Review slow queries
- Increase timeout threshold
- Scale database

Issue: High memory usage
Solution:
- Review memory leaks
- Optimize code
- Increase server memory
- Enable compression

Issue: Performance degradation
Solution:
- Check database indexes
- Review query performance
- Monitor server resources
- Clear caches
- Optimize code
```

---

## Compliance & Security

### Data Protection

- [ ] GDPR compliance
- [ ] Data encryption at rest
- [ ] Data encryption in transit (HTTPS)
- [ ] Regular security audits
- [ ] Dependency scanning
- [ ] Vulnerability management

### Logging

- [ ] Audit logging enabled
- [ ] Error logging configured
- [ ] Log retention policy set
- [ ] Log access restricted
- [ ] Sensitive data not logged

---

## Go-Live Checklist

- [ ] All tests passing
- [ ] Performance verified
- [ ] Security audit completed
- [ ] Documentation finalized
- [ ] Deployment plan documented
- [ ] Rollback plan ready
- [ ] Team trained
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Support plan in place

---

**Congratulations! Your expense tracker is ready for production!** 🚀
