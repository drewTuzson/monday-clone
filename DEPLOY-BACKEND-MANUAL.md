# Manual Backend Deployment Guide

Follow these steps to deploy your backend and make your app fully functional:

## 🗄️ Step 1: Set up Neon PostgreSQL (2 minutes)

1. Go to **[neon.tech](https://neon.tech)**
2. Click **"Sign up"** and use GitHub
3. Click **"Create Project"**:
   - Name: `monday-clone`
   - Leave other settings as default
4. **Copy the connection string**:
   - You'll see it in the dashboard
   - Format: `postgresql://username:password@hostname/database`
   - **Save this** - you'll need it soon!

## 🔴 Step 2: Set up Upstash Redis (2 minutes)

1. Go to **[upstash.com](https://upstash.com)**
2. Click **"Get Started"** and use GitHub
3. Click **"Create Database"**:
   - Name: `monday-clone-redis`
   - Region: Same as Neon (usually US East)
   - Type: Regional (free)
4. **Copy the Redis URL**:
   - Click on your database
   - Copy the connection string
   - Format: `redis://username:password@hostname:port`
   - **Save this** - you'll need it soon!

## 🚄 Step 3: Deploy to Railway (5 minutes)

1. Go to **[railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. **Connect GitHub** and select your repository
5. **Important**: Click **"Configure"** and set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

6. **Set Environment Variables** (click Variables tab):
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=<paste-your-neon-url-here>
   REDIS_URL=<paste-your-upstash-url-here>
   JWT_SECRET=monday-clone-super-secret-jwt-key-2024
   JWT_REFRESH_SECRET=monday-clone-super-secret-refresh-key-2024
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://frontend-6b1iw8ygw-drew-tuzsons-projects.vercel.app
   ```

7. Click **"Deploy"**
8. **Wait 2-3 minutes** for deployment
9. **Copy your Railway URL** (looks like `https://backend-production-xxxx.up.railway.app`)

## 🗃️ Step 4: Set up Database Schema (1 minute)

Run this command in your terminal to create the database tables:

```bash
cd "/Users/andrewtuzson/Documents/Cursor/Cursor/Monday Clone/backend"
DATABASE_URL="<your-neon-connection-string>" npx prisma migrate deploy
```

Replace `<your-neon-connection-string>` with the URL you copied from Neon.

## ⚡ Step 5: Update Frontend Environment Variables (2 minutes)

1. Go to **[vercel.com](https://vercel.com)**
2. Find your **frontend** project
3. Go to **Settings > Environment Variables**
4. **Add these variables**:
   ```
   VITE_GRAPHQL_URL=<your-railway-url>/graphql
   VITE_GRAPHQL_WS_URL=<your-railway-url>/graphql
   ```
   Replace `<your-railway-url>` with your Railway URL (but change `https://` to `wss://` for the WebSocket URL)

5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment

## 🎉 Step 6: Test Your App!

1. **Wait 2-3 minutes** for everything to deploy
2. **Visit your Vercel URL**: https://frontend-6b1iw8ygw-drew-tuzsons-projects.vercel.app
3. **Try registering** a new account
4. **Create a workspace** and board
5. **Everything should work now!**

---

## 🔧 Troubleshooting

**If registration doesn't work:**
- Check Railway logs for errors
- Verify DATABASE_URL is correct
- Make sure database migration ran successfully

**If you get CORS errors:**
- Check CORS_ORIGIN in Railway environment variables
- Make sure it matches your Vercel URL exactly

**If WebSocket doesn't work:**
- Make sure VITE_GRAPHQL_WS_URL starts with `wss://`
- Check that your Railway app is running

---

## 💰 Costs Summary

- **Neon PostgreSQL**: Free forever (500MB storage)
- **Upstash Redis**: Free forever (10K commands/day)  
- **Railway**: $5/month (includes hosting + bandwidth)
- **Vercel**: Free forever

**Total: $5/month for production-ready deployment**

---

## 🚀 Next Steps After Deployment

Once everything is working, you can:
- Add custom domain to Vercel
- Set up monitoring and logs
- Add more users to test
- Continue building features from the PRD

**Your Monday.com clone will be fully functional! 🎊**