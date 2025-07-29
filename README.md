# Monday.com Clone

A comprehensive clone of Monday.com work management platform built with modern web technologies.

## 🚀 Features

- **User Authentication**: JWT-based authentication with login/register
- **Workspaces**: Multi-workspace support with role-based access
- **Boards**: Create and manage project boards with custom columns
- **Real-time Updates**: WebSocket-based live updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **GraphQL API**: Efficient data fetching with Apollo Client

## 🛠 Tech Stack

### Backend
- **Node.js** with TypeScript
- **GraphQL** with Apollo Server
- **PostgreSQL** database
- **Prisma** ORM
- **Redis** for caching
- **JWT** authentication
- **WebSockets** for real-time features

### Frontend
- **React 18** with TypeScript
- **Vite** build tool
- **Apollo Client** for GraphQL
- **Tailwind CSS** for styling
- **Radix UI** components
- **Zustand** for state management
- **React Router** for navigation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Docker and Docker Compose (for databases)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monday-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Databases

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 4. Set up the Backend

```bash
cd backend
npm install
```

Copy the environment file and update if needed:
```bash
cp .env.example .env
```

Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create environment file:
```bash
cp .env.example .env
# or create with:
echo "VITE_GRAPHQL_URL=http://localhost:4000/graphql" > .env
echo "VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql" >> .env
```

### 6. Start the Development Servers

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend concurrently.

Alternatively, start them separately:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- Frontend: http://localhost:5173
- Backend GraphQL Playground: http://localhost:4000/graphql
- Prisma Studio: `npx prisma studio` (from backend directory)

## 📁 Project Structure

```
monday-clone/
├── backend/                 # Node.js backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── graphql/        # GraphQL schema and resolvers
│   │   ├── db/             # Database clients (Prisma, Redis)
│   │   ├── utils/          # Utility functions
│   │   ├── middleware/     # Express middleware
│   │   └── index.ts        # Entry point
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── main.tsx        # Entry point
│   └── package.json
├── shared/                 # Shared types and utilities
├── docker-compose.yml      # Database containers
└── package.json           # Root workspace configuration
```

## 🎯 Usage

### Creating Your First Workspace

1. Register a new account or login
2. You'll be redirected to the dashboard
3. Click "Create Workspace" to set up your first workspace
4. Add team members and start creating boards

### Working with Boards

1. Navigate to a workspace
2. Click "Create Board" to add a project board
3. Customize columns to match your workflow
4. Add items and start tracking your work
5. Invite team members to collaborate

## 🔧 Development

### Database Operations

**Reset database:**
```bash
cd backend
npx prisma migrate reset
```

**Generate Prisma client:**
```bash
npx prisma generate
```

**View database:**
```bash
npx prisma studio
```

### Code Quality

**Type checking:**
```bash
npm run typecheck
```

**Linting:**
```bash
npm run lint
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🐳 Docker Deployment

1. Build the application:
```bash
npm run build
```

2. Start with Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

Run tests for both frontend and backend:
```bash
npm test
```

## 📚 API Documentation

The GraphQL API is self-documenting. Visit http://localhost:4000/graphql to explore the schema and run queries.

### Key GraphQL Operations

**Authentication:**
- `login(email, password)` - User login
- `register(input)` - User registration
- `me` - Get current user

**Workspaces:**
- `workspaces` - List user workspaces
- `createWorkspace(input)` - Create new workspace

**Boards:**
- `boards(workspaceId)` - List workspace boards
- `board(id)` - Get board details
- `createBoard(input)` - Create new board

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/monday_clone
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Database connection failed:**
- Ensure Docker containers are running: `docker-compose ps`
- Check database URL in .env file

**GraphQL errors:**
- Verify backend is running on port 4000
- Check browser console for detailed errors

**Build errors:**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `npm run clean`

**WebSocket connection failed:**
- Ensure WebSocket URL is correct in frontend .env
- Check firewall settings

### Getting Help

- Check the [Issues](https://github.com/your-repo/monday-clone/issues) page
- Create a new issue with detailed error information
- Include your environment details and steps to reproduce

## 🔄 Roadmap

- [ ] Advanced board views (Kanban, Calendar, Gantt)
- [ ] Automation engine
- [ ] File attachments
- [ ] Mobile app
- [ ] Third-party integrations
- [ ] Advanced permissions
- [ ] Dashboard widgets
- [ ] Time tracking
- [ ] Reporting and analytics

---

Built with ❤️ by the Monday Clone team