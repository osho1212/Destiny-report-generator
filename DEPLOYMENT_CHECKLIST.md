# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment.

---

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] Frontend runs on `http://localhost:3000`
- [ ] Backend runs on `http://localhost:5001`
- [ ] PDF generation works
- [ ] File uploads work
- [ ] No console errors

### Git Setup
- [ ] Code committed to git
- [ ] No uncommitted changes
- [ ] Repository pushed to GitHub
- [ ] Repository is public (or Vercel/Railway has access)

### Configuration Files
- [ ] `vercel.json` exists in root
- [ ] `railway.toml` exists in root
- [ ] `frontend/.env.production` created
- [ ] `frontend/.env.development` created
- [ ] `.env.example` created

### Run Deploy Check
```bash
./deploy-check.sh
```
- [ ] All checks pass

---

## Backend Deployment (Railway)

### Create Project
- [ ] Railway account created
- [ ] New project created
- [ ] GitHub repository connected

### Configure Settings
- [ ] Root directory set to `backend`
- [ ] Start command: `python app.py`
- [ ] Deployed successfully

### Environment Variables
- [ ] `PORT` = `5001`
- [ ] `FLASK_DEBUG` = `false`
- [ ] `ALLOWED_ORIGINS` = (will update after Vercel)

### Test Backend
- [ ] Railway URL obtained
- [ ] Health check works: `https://your-app.up.railway.app/api/health`
- [ ] Returns: `{"status": "healthy"}`

**Railway URL:** ___________________________________

---

## Frontend Deployment (Vercel)

### Create Project
- [ ] Vercel account created
- [ ] GitHub repository imported
- [ ] Project created

### Configure Settings
- [ ] Framework: Create React App
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`

### Environment Variables
- [ ] `REACT_APP_API_URL` = `https://your-railway-url.up.railway.app/api`
- [ ] (Use Railway URL from above)

### Deploy
- [ ] Deployment successful
- [ ] Vercel URL obtained
- [ ] App loads correctly

**Vercel URL:** ___________________________________

---

## Connect Frontend & Backend

### Update Railway CORS
- [ ] Go to Railway → Variables
- [ ] Update `ALLOWED_ORIGINS`:
  ```
  ALLOWED_ORIGINS=https://your-vercel-url.vercel.app,https://*.vercel.app
  ```
- [ ] Service redeployed

### Update Frontend Environment
- [ ] Edit `frontend/.env.production`
- [ ] Set correct Railway URL
- [ ] Commit and push changes
  ```bash
  git add frontend/.env.production
  git commit -m "Update production API URL"
  git push origin main
  ```
- [ ] Vercel auto-deploys

---

## Final Testing

### Frontend Tests
- [ ] App loads at Vercel URL
- [ ] Dark mode toggle works
- [ ] Form displays correctly
- [ ] All sections visible

### Upload Tests
- [ ] Can upload Kundli PDF
- [ ] Can upload house map images
- [ ] Images display in preview

### Form Functionality
- [ ] Can fill all fields
- [ ] Aspects configuration works
- [ ] Dasha fields work
- [ ] No Star checkbox works

### Preview & Export
- [ ] Preview modal opens
- [ ] All data displays correctly
- [ ] Export button works
- [ ] PDF downloads successfully
- [ ] PDF content is correct

### Mobile Testing
- [ ] Open Vercel URL on mobile
- [ ] App is responsive
- [ ] Forms are usable
- [ ] Touch targets work
- [ ] Preview works on mobile
- [ ] Export works on mobile

### API Testing
- [ ] Health check: `https://your-railway-url.up.railway.app/api/health`
- [ ] No CORS errors in browser console
- [ ] API responses are fast
- [ ] Error handling works

---

## Post-Deployment

### Documentation
- [ ] Update `DEPLOYMENT_SUMMARY.md` with your URLs
- [ ] Document any custom changes
- [ ] Save Railway and Vercel dashboard URLs

### Monitoring
- [ ] Set up alerts (optional)
- [ ] Bookmark dashboards:
  - Vercel: https://vercel.com/dashboard
  - Railway: https://railway.app/dashboard

### Share
- [ ] Test URL from different device
- [ ] Share URL with team/clients
- [ ] Verify works for others

---

## Your Deployment URLs

Record your URLs here for reference:

**Frontend (Vercel):**
```
https://___________________________________.vercel.app
```

**Backend (Railway):**
```
https://___________________________________.up.railway.app
```

**Health Check:**
```
https://___________________________________.up.railway.app/api/health
```

---

## Troubleshooting

### If Frontend Won't Load:
1. Check Vercel deployment logs
2. Verify build completed successfully
3. Check for build errors in logs

### If "Failed to generate report":
1. Check Railway logs for errors
2. Verify `ALLOWED_ORIGINS` includes Vercel URL
3. Check browser console for CORS errors
4. Test health endpoint directly

### If Mobile Not Working:
1. Ensure using HTTPS URL (not HTTP)
2. Clear browser cache on mobile
3. Try incognito/private mode
4. Check if Railway backend is sleeping (cold start)

---

## Success Metrics

✅ **Deployment Successful When:**
- Frontend loads globally
- Backend responds to API calls
- PDF generation works
- Mobile access works
- No CORS errors
- Uploads work correctly

---

## Need Help?

See detailed guides:
- [Complete Deployment Guide](docs/DEPLOYMENT_COMPLETE.md)
- [Troubleshooting Section](docs/DEPLOYMENT_COMPLETE.md#common-issues)
- [Quick Start](docs/QUICK_START.md)

---

**Last Updated:** _______________
**Deployed By:** _______________
**Notes:**
_____________________________________
_____________________________________
_____________________________________
