import { gql, useQuery } from '@apollo/client'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>

  const workspaces = data?.workspaces || []
  const currentWorkspace = selectedWorkspace 
    ? workspaces.find((w: any) => w.id === selectedWorkspace)
    : workspaces[0]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening across your workspaces
        </p>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              No workspaces yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first workspace to get started with organizing your work.
            </p>
            <Button>Create Workspace</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Workspace Selector */}
          <div className="flex space-x-4">
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

          {/* Current Workspace Content */}
          {currentWorkspace && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentWorkspace.name}
                </h2>
                <Button>Create Board</Button>
              </div>

              {currentWorkspace.boards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No boards in this workspace yet.</p>
                  <Button variant="outline">Create your first board</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentWorkspace.boards.map((board: any) => (
                    <div
                      key={board.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {board.name}
                      </h3>
                      {board.description && (
                        <p className="text-gray-600 text-sm mb-3">
                          {board.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{board.type.toLowerCase()}</span>
                        <span>
                          {new Date(board.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}