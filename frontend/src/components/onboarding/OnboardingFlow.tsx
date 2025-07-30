import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

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

interface OnboardingFlowProps {
  onComplete: () => void
}

type OnboardingStep = 'welcome' | 'workspace' | 'templates' | 'team' | 'complete'

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [workspaceData, setWorkspaceData] = useState({
    name: '',
    slug: '',
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [teamEmails, setTeamEmails] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { toast } = useToast()
  const navigate = useNavigate()
  const [createWorkspace] = useMutation(CREATE_WORKSPACE, {
    refetchQueries: [{ query: GET_WORKSPACES }],
  })

  const templates = [
    {
      id: 'project-management',
      name: 'Project Management',
      description: 'Manage projects, tasks, and deadlines',
      icon: '📋',
      preview: ['Task Name', 'Status', 'Owner', 'Due Date', 'Priority']
    },
    {
      id: 'sales-crm',
      name: 'Sales CRM',
      description: 'Track leads, deals, and customer relationships',
      icon: '💼',
      preview: ['Lead Name', 'Status', 'Value', 'Close Date', 'Source']
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      description: 'Plan and execute marketing campaigns',
      icon: '📢',
      preview: ['Campaign', 'Status', 'Channel', 'Budget', 'ROI']
    },
    {
      id: 'hr-recruitment',
      name: 'HR Recruitment',
      description: 'Manage job openings and candidate pipeline',
      icon: '👥',
      preview: ['Candidate', 'Position', 'Status', 'Interview Date', 'Rating']
    },
    {
      id: 'it-requests',
      name: 'IT Requests',
      description: 'Track and manage IT support tickets',
      icon: '🖥️',
      preview: ['Request', 'Priority', 'Assignee', 'Status', 'Due Date']
    },
    {
      id: 'blank',
      name: 'Start from Scratch',
      description: 'Create a custom board with your own columns',
      icon: '✨',
      preview: ['Item', 'Status', 'Person', 'Date']
    }
  ]

  const handleWorkspaceSubmit = async () => {
    if (!workspaceData.name.trim()) {
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
            name: workspaceData.name.trim(),
            slug: workspaceData.slug || workspaceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          },
        },
      })
      setCurrentStep('templates')
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

  const handleSkipToEnd = () => {
    setCurrentStep('complete')
  }

  const handleComplete = () => {
    onComplete()
    navigate('/')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to Monday Clone!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let's get you set up with your first workspace. This will only take a few minutes, 
              and you can always customize things later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setCurrentStep('workspace')}
                className="bg-monday-blue hover:bg-monday-blue/90 text-white px-8 py-3"
              >
                Let's Get Started
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipToEnd}
                className="px-8 py-3"
              >
                Skip Setup
              </Button>
            </div>
          </div>
        )

      case 'workspace':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your first workspace
              </h2>
              <p className="text-gray-600">
                A workspace is where your team collaborates on projects and tasks
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <Input
                  id="workspace-name"
                  type="text"
                  placeholder="My Awesome Team"
                  value={workspaceData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setWorkspaceData(prev => ({
                      ...prev,
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                    }))
                  }}
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="workspace-slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace URL (optional)
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">workspace/</span>
                  <Input
                    id="workspace-slug"
                    type="text"
                    placeholder="my-awesome-team"
                    value={workspaceData.slug}
                    onChange={(e) => setWorkspaceData(prev => ({ ...prev, slug: e.target.value }))}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('welcome')}
              >
                Back
              </Button>
              <Button
                onClick={handleWorkspaceSubmit}
                disabled={isLoading || !workspaceData.name.trim()}
                className="bg-monday-blue hover:bg-monday-blue/90 text-white"
              >
                {isLoading ? 'Creating...' : 'Create Workspace'}
              </Button>
            </div>
          </div>
        )

      case 'templates':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose a template to get started
              </h2>
              <p className="text-gray-600">
                Templates help you set up your board quickly with the right columns for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-monday-blue bg-monday-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  </div>
                  
                  <div className="text-xs">
                    <div className="font-medium text-gray-700 mb-1">Preview columns:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.preview.map((column, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {column}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('workspace')}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep('team')}
                disabled={!selectedTemplate}
                className="bg-monday-blue hover:bg-monday-blue/90 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invite your team
              </h2>
              <p className="text-gray-600">
                Add team members now or skip this step and invite them later
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <label htmlFor="team-emails" className="block text-sm font-medium text-gray-700 mb-2">
                Email addresses (one per line)
              </label>
              <textarea
                id="team-emails"
                rows={4}
                placeholder="john@company.com&#10;jane@company.com&#10;mike@company.com"
                value={teamEmails}
                onChange={(e) => setTeamEmails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-monday-blue focus:border-monday-blue"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send them an invitation to join your workspace
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('templates')}
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep('complete')}
              >
                Skip for Now
              </Button>
              <Button
                onClick={() => {
                  // Here you would normally send invitations
                  toast({
                    title: 'Invitations Sent!',
                    description: `Invitations sent to ${teamEmails.split('\n').filter(email => email.trim()).length} team members`,
                  })
                  setCurrentStep('complete')
                }}
                disabled={!teamEmails.trim()}
                className="bg-monday-blue hover:bg-monday-blue/90 text-white"
              >
                Send Invitations
              </Button>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-gray-900">
              You're all set!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your workspace is ready to go. You can now start creating boards, 
              adding tasks, and collaborating with your team.
            </p>
            
            <div className="bg-monday-blue/5 border border-monday-blue/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Click the "+" button to add new items</li>
                <li>• Drag and drop to reorganize tasks</li>
                <li>• Use @mentions to notify team members</li>
                <li>• Explore automations to save time</li>
              </ul>
            </div>

            <Button
              onClick={handleComplete}
              className="bg-monday-blue hover:bg-monday-blue/90 text-white px-8 py-3"
            >
              Go to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-monday-blue/5 via-white to-monday-purple/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 max-w-4xl w-full">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {['welcome', 'workspace', 'templates', 'team', 'complete'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  ['welcome', 'workspace', 'templates', 'team', 'complete'].indexOf(currentStep) >= index
                    ? 'bg-monday-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 4 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    ['welcome', 'workspace', 'templates', 'team', 'complete'].indexOf(currentStep) > index
                      ? 'bg-monday-blue'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </div>
  )
}