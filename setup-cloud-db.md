# Cloud Database Setup Guide

## Step 1: Set up Neon PostgreSQL Database (Free)

1. **Go to [neon.tech](https://neon.tech)**
2. **Sign up with GitHub** (easiest)
3. **Create a new project**:
   - Project name: `monday-clone`
   - Region: Choose closest to you
   - PostgreSQL version: 15 (default)
4. **Copy the connection string**:
   - Go to your project dashboard
   - Click "Connection Details"
   - Copy the connection string (looks like this):
   ```
   postgresql://username:password@hostname:5432/neondb?sslmode=require
   ```

## Step 2: Set up Upstash Redis (Free)

1. **Go to [upstash.com](https://upstash.com)**
2. **Sign up with GitHub**
3. **Create a new database**:
   - Name: `monday-clone-redis`
   - Region: Choose same as Neon
   - Type: Regional (free)
4. **Copy the Redis URL**:
   - Go to database details
   - Copy the connection string (looks like this):
   ```
   redis://username:password@hostname:port
   ```

## Step 3: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create new project from GitHub repo**:
   - Connect your GitHub account
   - Select your Monday Clone repository
   - Choose the `backend` folder as root directory

4. **Set Environment Variables** in Railway:
   ```
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=<your-neon-connection-string>
   REDIS_URL=<your-upstash-redis-url>
   JWT_SECRET=your-super-secure-256-bit-secret-key-here
   JWT_REFRESH_SECRET=your-super-secure-256-bit-refresh-secret-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://frontend-6b1iw8ygw-drew-tuzsons-projects.vercel.app
   ```

5. **Deploy and get your backend URL**:
   - Railway will give you a URL like: `https://your-app-name.railway.app`

## Step 4: Run Database Migrations

After deployment, run this command to set up the database schema:

```bash
# In your local backend directory
DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
```

## Step 5: Update Frontend Environment Variables

1. **Go to [vercel.com](https://vercel.com)**
2. **Find your frontend project**
3. **Go to Settings > Environment Variables**
4. **Add these variables**:
   ```
   VITE_GRAPHQL_URL=https://your-app-name.railway.app/graphql
   VITE_GRAPHQL_WS_URL=wss://your-app-name.railway.app/graphql
   ```
5. **Redeploy frontend** to pick up new variables

## Quick Links for Setup:

- 🐘 **Neon PostgreSQL**: https://neon.tech
- 🔴 **Upstash Redis**: https://upstash.com
- 🚄 **Railway Hosting**: https://railway.app
- ⚡ **Vercel Frontend**: https://vercel.com

## Expected Costs:

- **Neon PostgreSQL**: Free (500MB, 10GB bandwidth)
- **Upstash Redis**: Free (10K commands/day)
- **Railway**: $5/month (includes hosting + bandwidth)
- **Vercel**: Free

**Total: $5/month for production-ready deployment**