import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import { useEffect } from 'react'
import { Toaster } from './components/ui/toaster'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import BoardPage from './pages/board/BoardPage'
import WorkspacePage from './pages/workspace/WorkspacePage'

// Layout
import AppLayout from './components/core/AppLayout'

function App() {
  const { initialize, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        {isAuthenticated ? (
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="workspace/:workspaceId" element={<WorkspacePage />} />
            <Route path="board/:boardId" element={<BoardPage />} />
          </Route>
        ) : (
          <Route path="*" element={<LandingPage />} />
        )}
      </Routes>
      <Toaster />
    </>
  )
}

export default App