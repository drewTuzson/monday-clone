import { useParams } from 'react-router-dom'

export default function WorkspacePage() {
  const { workspaceId } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Workspace: {workspaceId}</h1>
      <p className="text-gray-600 mt-2">This page is under construction.</p>
    </div>
  )
}