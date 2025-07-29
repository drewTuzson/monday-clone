#!/bin/bash

echo "🚀 Monday Clone Backend Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you deploy the backend to Railway${NC}"
echo ""

# Check if user has accounts
echo -e "${YELLOW}Before proceeding, make sure you have:${NC}"
echo "1. ✅ Neon.tech account with PostgreSQL database"
echo "2. ✅ Upstash.com account with Redis database"  
echo "3. ✅ Railway.app account"
echo ""

read -p "Do you have all accounts set up? (y/n): " accounts_ready

if [[ $accounts_ready != "y" ]]; then
    echo -e "${RED}Please set up the required accounts first:${NC}"
    echo "- Neon PostgreSQL: https://neon.tech"
    echo "- Upstash Redis: https://upstash.com"
    echo "- Railway: https://railway.app"
    echo ""
    echo "Follow the guide in setup-cloud-db.md"
    exit 1
fi

# Get database URLs
echo -e "${BLUE}Enter your database connection details:${NC}"
echo ""

read -p "Enter your Neon PostgreSQL URL: " DATABASE_URL
read -p "Enter your Upstash Redis URL: " REDIS_URL

# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

echo -e "${GREEN}Generated secure JWT secrets${NC}"

# Create production environment file
cd backend

cat > .env.production << EOF
NODE_ENV=production
PORT=4000
DATABASE_URL=$DATABASE_URL
REDIS_URL=$REDIS_URL
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://frontend-6b1iw8ygw-drew-tuzsons-projects.vercel.app
EOF

echo -e "${GREEN}Created .env.production file${NC}"

# Login to Railway
echo -e "${BLUE}Logging into Railway...${NC}"
railway login

# Initialize Railway project
echo -e "${BLUE}Setting up Railway project...${NC}"
railway init

# Deploy to Railway
echo -e "${BLUE}Deploying to Railway...${NC}"
railway up

echo -e "${GREEN}Backend deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run database migrations:"
echo "   DATABASE_URL=\"$DATABASE_URL\" npx prisma migrate deploy"
echo ""
echo "2. Get your Railway app URL and update frontend environment variables"
echo "3. Redeploy frontend with new backend URL"
echo ""
echo -e "${GREEN}Deployment complete! 🎉${NC}"