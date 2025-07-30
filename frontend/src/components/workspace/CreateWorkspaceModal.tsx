import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
      slug
      logoUrl
      createdAt
    }
  }
`

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

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const [createWorkspace] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [{ query: GET_WORKSPACES }],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name
      ...(name === 'name' && {
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Workspace name is required',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await createWorkspace({
        variables: {
          input: {
            name: formData.name.trim(),
            slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          },
        },
      })

      toast({
        title: 'Success',
        description: 'Workspace created successfully!',
      })

      setFormData({ name: '', slug: '' })
      onClose()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create workspace',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Workspace</h2>
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
              Workspace Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="My Awesome Workspace"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace URL (optional)
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">workspace/</span>
              <Input
                id="slug"
                name="slug"
                type="text"
                placeholder="my-awesome-workspace"
                value={formData.slug}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to auto-generate from name
            </p>
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
              {isLoading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}