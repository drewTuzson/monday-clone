import { gql, useQuery } from '@apollo/client'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CreateWorkspaceModal from '@/components/workspace/CreateWorkspaceModal'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import { useOnboarding } from '@/hooks/useOnboarding'
import { DashboardSkeleton, FullPageLoading } from '@/components/ui/loading'
import { WorkspaceEmptyState, BoardEmptyState, TaskEmptyState, ActivityEmptyState, ErrorState } from '@/components/ui/empty-state'

const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
      slug
      logoUrl
      boards {
        id
        name
        description
        type
        createdAt
      }
    }
  }
`

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { data, loading, error } = useQuery(GET_WORKSPACES)
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { shouldShowOnboarding, isChecking, completeOnboarding } = useOnboarding()

  if (isChecking) {
    return <FullPageLoading message="Loading your workspace..." />
  }

  if (shouldShowOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />
  }

  if (loading) {
    return <DashboardSkeleton />
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          title="Failed to load dashboard"
          description={error.message || "We're having trouble loading your workspaces. Please try again."}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const workspaces = data?.workspaces || []
  const currentWorkspace = selectedWorkspace 
    ? workspaces.find((w: any) => w.id === selectedWorkspace)
    : workspaces[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good morning, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <span>+</span>
              <span>New Workspace</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {workspaces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <WorkspaceEmptyState onCreateWorkspace={() => setIsCreateModalOpen(true)} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-monday-blue/10 rounded-lg">
                    <div className="w-6 h-6 text-monday-blue">📋</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Boards</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {workspaces.reduce((total: number, workspace: any) => total + workspace.boards.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-monday-green/10 rounded-lg">
                    <div className="w-6 h-6 text-monday-green">✅</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tasks Assigned</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-monday-orange/10 rounded-lg">
                    <div className="w-6 h-6 text-monday-orange">⏰</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Due This Week</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-monday-purple/10 rounded-lg">
                    <div className="w-6 h-6 text-monday-purple">🏢</div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Workspaces</p>
                    <p className="text-2xl font-bold text-gray-900">{workspaces.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Work Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">My Work</h2>
                <p className="text-gray-600 text-sm">Tasks and items assigned to you</p>
              </div>
              <div className="p-6">
                <TaskEmptyState 
                  onCreateTask={() => console.log('Create task')}
                  onViewGuide={() => console.log('View guide')}
                />
              </div>
            </div>

            {/* Workspaces Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Workspaces</h2>
                <div className="flex space-x-2">
                  {workspaces.map((workspace: any) => (
                    <button
                      key={workspace.id}
                      onClick={() => setSelectedWorkspace(workspace.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        workspace.id === (selectedWorkspace || workspaces[0]?.id)
                          ? 'bg-monday-blue text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {workspace.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Workspace Content */}
              {currentWorkspace && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {currentWorkspace.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {currentWorkspace.boards.length} boards
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => {
                          // Navigate to workspace page when implemented
                          console.log(`Navigate to workspace ${currentWorkspace.id}`)
                        }}
                      >
                        <span>View Workspace</span>
                        <span>→</span>
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    {currentWorkspace.boards.length === 0 ? (
                      <BoardEmptyState 
                        workspaceName={currentWorkspace.name}
                        onCreateBoard={() => console.log('Create board')}
                        onViewTemplates={() => console.log('View templates')}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentWorkspace.boards.map((board: any) => (
                          <div
                            key={board.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-monday-blue/30"
                            onClick={() => {
                              // Navigate to board page when implemented
                              console.log(`Navigate to board ${board.id}`)
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {board.name}
                              </h4>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                                {board.type.toLowerCase()}
                              </span>
                            </div>
                            {board.description && (
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {board.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>0 items</span>
                              <span>
                                Updated {new Date(board.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-gray-600 text-sm">Latest updates from your workspaces</p>
              </div>
              <div className="p-6">
                <ActivityEmptyState 
                  onExploreFeatures={() => console.log('Explore features')}
                />
              </div>
            </div>
          </div>
        )}

        <CreateWorkspaceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  )
}