#!/bin/bash

echo "🚀 Deploying Monday Clone Frontend to Vercel..."

# Navigate to frontend directory
cd frontend

# Build the project
echo "📦 Building frontend..."
npm run build

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at the provided URL"
echo ""
echo "⚠️ Don't forget to:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Deploy the backend to Railway/Render"
echo "3. Update VITE_GRAPHQL_URL to point to your backend"