#!/bin/bash

echo "🚀 Setting up Monday Clone databases..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew already installed"
fi

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
brew install postgresql@15

# Start PostgreSQL
echo "🚀 Starting PostgreSQL service..."
brew services start postgresql@15

# Wait a moment for service to start
sleep 3

# Create database
echo "📊 Creating monday_clone database..."
createdb monday_clone

# Install Redis
echo "🔴 Installing Redis..."
brew install redis

# Start Redis
echo "🚀 Starting Redis service..."
brew services start redis

echo "✅ Database setup complete!"
echo "🎉 You can now run the backend with: cd backend && npm run dev"