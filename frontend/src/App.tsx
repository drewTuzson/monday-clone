import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import { useEffect } from 'react'
import { Toaster } from './components/ui/toaster'

// Pages
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

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
        <Toaster />
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="workspace/:workspaceId" element={<WorkspacePage />} />
          <Route path="board/:boardId" element={<BoardPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App