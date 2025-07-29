#!/bin/bash

echo "🗄️  Setting up Monday Clone database schema..."

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide DATABASE_URL as first argument"
    echo "Usage: ./migrate-cloud-db.sh 'postgresql://username:password@hostname:port/database'"
    exit 1
fi

DATABASE_URL="$1"

echo "✅ Using database: $(echo $DATABASE_URL | sed 's/:[^:]*@/:***@/g')"

# Navigate to backend directory
cd backend

# Run Prisma migration
echo "🔄 Running database migration..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully!"
    echo "🎉 Your database is ready for the Monday Clone app!"
else
    echo "❌ Migration failed. Please check your DATABASE_URL and try again."
    exit 1
fi