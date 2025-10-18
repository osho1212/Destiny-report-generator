# Deployment Guide for Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## Steps to Deploy

### 1. Push your code to a Git repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Important Notes

### Backend Limitations on Vercel
Vercel serverless functions have limitations:
- **Execution timeout**: 10 seconds (Hobby), 60 seconds (Pro)
- **Payload size**: 4.5 MB request, 4.5 MB response
- **Memory**: 1024 MB (Hobby), 3008 MB (Pro)

### PDF Generation Issues
Your backend generates PDFs which might:
1. Take longer than 10 seconds (will timeout on Hobby plan)
2. Generate files larger than 4.5 MB (will fail)

### Recommended Solution
For production deployment with PDF generation, consider:

1. **Use a dedicated backend hosting service**:
   - Railway.app (https://railway.app)
   - Render.com (https://render.com)
   - Heroku
   - DigitalOcean App Platform

2. **Deploy frontend to Vercel** and **backend separately**:
   - Deploy only the frontend to Vercel
   - Deploy backend to Railway/Render
   - Update API URLs in frontend to point to your backend URL

### To Deploy Frontend Only to Vercel

Update `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/build",
  "devCommand": "cd frontend && npm start",
  "installCommand": "cd frontend && npm install"
}
```

Then update frontend API calls to use your backend URL (e.g., Railway deployment).

## Environment Variables
If you deploy backend separately, add these in Vercel dashboard:
- `REACT_APP_API_URL`: Your backend API URL

## Mobile Access
Once deployed, your app will be accessible at:
`https://your-project-name.vercel.app`

This URL will work on mobile devices too!
