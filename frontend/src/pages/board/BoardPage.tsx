import { useParams } from 'react-router-dom'

export default function BoardPage() {
  const { boardId } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Board: {boardId}</h1>
      <p className="text-gray-600 mt-2">This page is under construction.</p>
    </div>
  )
}