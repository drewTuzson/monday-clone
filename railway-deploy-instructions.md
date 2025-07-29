# Railway Deployment - Step by Step

## Current Railway UI (2024)

### Step 1: Create Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose "drewTuzson/monday-clone"

### Step 2: Configure Service
After the project is created:

1. **Click on the service** (should be named "backend" or similar)
2. **Go to "Settings" tab**
3. **Set Root Directory**: 
   - Scroll down to "Root Directory"  
   - Enter: `backend`
4. **Set Build Command**:
   - Find "Build Command" field
   - Enter: `npm run build`
5. **Set Start Command**:
   - Find "Start Command" field  
   - Enter: `npm start`

### Step 3: Add Environment Variables
1. **Click "Variables" tab**
2. **Add each variable one by one**:

```
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://neondb_owner:npg_54iUrxjebaHQ@ep-gentle-truth-ad89vaxm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
REDIS_URL=redis://default:AeGGAAIjcDE1MmVlNzAzYTY2NjY0MDc2YTljOTYzN2VjYzc3YTM0ZnAxMA@classic-ladybug-57734.upstash.io:6379
JWT_SECRET=bb76117cd44d2fa22e3ffacaa72af262f372cf6f5bae1aa04071fde9c90935df
JWT_REFRESH_SECRET=bd6263f2c6bc2c098714e3dbfe386eb83f898a17c22c1f5dd7f71fe36f258e84
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://frontend-6b1iw8ygw-drew-tuzsons-projects.vercel.app
```

### Step 4: Deploy
1. **Click "Deploy"** or wait for auto-deploy
2. **Wait 2-3 minutes**
3. **Get your URL** from the "Deployments" tab

## If You Get Stuck
- Try refreshing the Railway page
- Look for "Service Settings" or "Deploy Settings"
- The UI might be slightly different but the options should be there

## What to Send Me
Once deployed, send me the Railway URL (like `https://your-app.railway.app`) and I'll complete the frontend setup!