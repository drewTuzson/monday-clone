import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const CREATE_BOARD = gql`
  mutation CreateBoard($input: CreateBoardInput!) {
    createBoard(input: $input) {
      id
      name
      description
      type
      createdAt
    }
  }
`

const GET_BOARDS = gql`
  query GetBoards($workspaceId: ID!) {
    boards(workspaceId: $workspaceId) {
      id
      name
      description
      type
      createdAt
    }
  }
`

interface CreateBoardModalProps {
  isOpen: boolean
  onClose: () => void
  workspaceId: string
  workspaceName: string
}

const boardTemplates = [
  {
    id: 'project',
    name: 'Project Management',
    description: 'Track project tasks, timelines, and deliverables',
    icon: '📋',
    defaultColumns: ['Status', 'Person', 'Date', 'Timeline']
  },
  {
    id: 'crm',
    name: 'Sales CRM',
    description: 'Manage leads, deals, and customer relationships',
    icon: '💼',
    defaultColumns: ['Status', 'Person', 'Email', 'Phone', 'Deal Value']
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Plan and track marketing campaigns and content',
    icon: '📢',
    defaultColumns: ['Status', 'Person', 'Date', 'Budget', 'Channel']
  },
  {
    id: 'hr',
    name: 'HR Recruitment',
    description: 'Streamline hiring and candidate tracking',
    icon: '👥',
    defaultColumns: ['Status', 'Person', 'Position', 'Date', 'Location']
  },
  {
    id: 'it',
    name: 'IT Requests',
    description: 'Handle IT tickets and support requests',
    icon: '🖥️',
    defaultColumns: ['Status', 'Person', 'Priority', 'Date', 'Category']
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Create a custom board with your own structure',
    icon: '✨',
    defaultColumns: ['Status', 'Person', 'Date']
  }
]

export default function CreateBoardModal({ isOpen, onClose, workspaceId, workspaceName }: CreateBoardModalProps) {
  const [step, setStep] = useState<'template' | 'details'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'MAIN' as 'MAIN' | 'PRIVATE' | 'SHAREABLE'
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const [createBoard] = useMutation(CREATE_BOARD, {
    refetchQueries: [{ query: GET_BOARDS, variables: { workspaceId } }],
  })

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = boardTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.name === 'Start from Scratch' ? '' : `${template.name} Board`,
        description: template.description
      }))
    }
    setStep('details')
  }

  const handleBack = () => {
    setStep('template')
    setSelectedTemplate(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Board name is required',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await createBoard({
        variables: {
          input: {
            workspaceId,
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            type: formData.type,
            templateId: selectedTemplate === 'blank' ? null : selectedTemplate
          },
        },
      })

      toast({
        title: 'Success',
        description: 'Board created successfully!',
      })

      // Reset form
      setFormData({ name: '', description: '', type: 'MAIN' })
      setSelectedTemplate(null)
      setStep('template')
      onClose()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create board',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {step === 'template' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Choose a template</h2>
                <p className="text-gray-600 mt-1">Select a template to get started quickly</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boardTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-monday-blue hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-monday-blue transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Board Details</h2>
                  <p className="text-gray-600">for {workspaceName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Board Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Q4 Marketing Campaign"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="What's this board for?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-monday-blue focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="MAIN"
                      checked={formData.type === 'MAIN'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Main Board</div>
                      <div className="text-sm text-gray-600">Visible to all workspace members</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="PRIVATE"
                      checked={formData.type === 'PRIVATE'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Private Board</div>
                      <div className="text-sm text-gray-600">Only visible to you and invited members</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="SHAREABLE"
                      checked={formData.type === 'SHAREABLE'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Shareable Board</div>
                      <div className="text-sm text-gray-600">Can be shared with external guests</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-monday-blue hover:bg-monday-blue/90"
                >
                  {isLoading ? 'Creating...' : 'Create Board'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}