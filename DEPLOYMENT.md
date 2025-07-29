# Deployment Guide

## 🚀 Deploy Monday Clone to Production

### Option 1: Frontend + Backend on Separate Services (Recommended)

#### Frontend Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial Monday Clone setup"
   git push origin main
   ```

2. **Deploy Frontend to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set build settings:
     - Framework: **Vite**
     - Root Directory: **frontend**
     - Build Command: **npm run build**
     - Output Directory: **dist**

3. **Environment Variables** in Vercel:
   ```
   VITE_GRAPHQL_URL=https://your-backend-url.com/graphql
   VITE_GRAPHQL_WS_URL=wss://your-backend-url.com/graphql
   ```

#### Backend Deployment (Railway/Render)

1. **Deploy Backend to Railway**:
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub
   - Set root directory to **backend**
   - Add environment variables from `.env.production`

2. **Set up Cloud Database**:
   - **Neon PostgreSQL**: [neon.tech](https://neon.tech) (Free)
   - **Supabase**: [supabase.com](https://supabase.com) (Free)
   - **Railway PostgreSQL**: Add as service in Railway

3. **Set up Redis**:
   - **Upstash Redis**: [upstash.com](https://upstash.com) (Free)
   - **Railway Redis**: Add as service in Railway

### Option 2: Full-Stack Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd "/Users/andrewtuzson/Documents/Cursor/Cursor/Monday Clone"
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   ```
   DATABASE_URL=your-cloud-database-url
   REDIS_URL=your-cloud-redis-url
   JWT_SECRET=your-secure-secret
   JWT_REFRESH_SECRET=your-secure-refresh-secret
   ```

### Step-by-Step Vercel Deployment

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

5. **Deploy Backend** (choose one):
   - **Railway**: [railway.app](https://railway.app)
   - **Render**: [render.com](https://render.com)
   - **Heroku**: [heroku.com](https://heroku.com)

### Quick Cloud Database Setup

#### Neon PostgreSQL (Free)
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Copy connection string
4. Run migrations: `npx prisma migrate deploy`

#### Upstash Redis (Free)
1. Go to [upstash.com](https://upstash.com)
2. Create account and new database
3. Copy connection string

### Environment Variables for Production

**Frontend (.env.production)**:
```
VITE_GRAPHQL_URL=https://your-backend.railway.app/graphql
VITE_GRAPHQL_WS_URL=wss://your-backend.railway.app/graphql
```

**Backend (Environment Variables in hosting service)**:
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://user:pass@host:port
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Post-Deployment Steps

1. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

2. **Test the Application**:
   - Visit your Vercel URL
   - Register a new account
   - Create a workspace
   - Test all functionality

3. **Set up Custom Domain** (Optional):
   - Add custom domain in Vercel dashboard
   - Update CORS_ORIGIN in backend

### Troubleshooting

- **CORS Errors**: Update CORS_ORIGIN in backend env vars
- **Database Connection**: Check DATABASE_URL format
- **Build Errors**: Check Node.js version compatibility
- **WebSocket Issues**: Ensure WSS protocol for HTTPS sites

### Cost Breakdown

**Free Tier Resources**:
- **Vercel**: Free hosting for frontend
- **Railway**: $5/month for backend + database
- **Neon**: Free PostgreSQL database
- **Upstash**: Free Redis database

**Total Monthly Cost**: ~$5/month for production-ready deployment