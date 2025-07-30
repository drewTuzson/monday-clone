import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="text-6xl mb-6">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className={action.variant === 'default' ? 'bg-monday-blue hover:bg-monday-blue/90' : ''}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Preset empty states for common scenarios
interface WorkspaceEmptyStateProps {
  onCreateWorkspace: () => void
}

export function WorkspaceEmptyState({ onCreateWorkspace }: WorkspaceEmptyStateProps) {
  return (
    <EmptyState
      icon="🚀"
      title="Welcome to Monday Clone!"
      description="Create your first workspace to start organizing your projects and collaborating with your team."
      action={{
        label: "Create Your First Workspace",
        onClick: onCreateWorkspace
      }}
    />
  )
}

interface BoardEmptyStateProps {
  workspaceName?: string
  onCreateBoard: () => void
  onViewTemplates?: () => void
}

export function BoardEmptyState({ workspaceName, onCreateBoard, onViewTemplates }: BoardEmptyStateProps) {
  return (
    <EmptyState
      icon="📋"
      title={`No boards in ${workspaceName || 'this workspace'} yet`}
      description="Boards help you organize your work into projects, campaigns, or any workflow that fits your team's needs."
      action={{
        label: "Create Your First Board",
        onClick: onCreateBoard
      }}
      secondaryAction={onViewTemplates ? {
        label: "Browse Templates",
        onClick: onViewTemplates
      } : undefined}
    />
  )
}

interface TaskEmptyStateProps {
  onCreateTask: () => void
  onViewGuide?: () => void
}

export function TaskEmptyState({ onCreateTask, onViewGuide }: TaskEmptyStateProps) {
  return (
    <EmptyState
      icon="📝"
      title="No tasks assigned to you yet"
      description="When team members assign tasks to you, they'll appear here. You can also create your own tasks to get started."
      action={{
        label: "Create Task",
        onClick: onCreateTask
      }}
      secondaryAction={onViewGuide ? {
        label: "Learn More",
        onClick: onViewGuide
      } : undefined}
    />
  )
}

interface SearchEmptyStateProps {
  query: string
  onClearSearch: () => void
  onCreateItem?: () => void
}

export function SearchEmptyState({ query, onClearSearch, onCreateItem }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon="🔍"
      title={`No results found for "${query}"`}
      description="Try adjusting your search terms or browse through your workspaces to find what you're looking for."
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline"
      }}
      secondaryAction={onCreateItem ? {
        label: "Create New Item",
        onClick: onCreateItem
      } : undefined}
    />
  )
}

interface ActivityEmptyStateProps {
  onExploreFeatures?: () => void
}

export function ActivityEmptyState({ onExploreFeatures }: ActivityEmptyStateProps) {
  return (
    <EmptyState
      icon="📈"
      title="No recent activity"
      description="Team activities and updates will appear here. Start by creating boards and inviting team members."
      action={onExploreFeatures ? {
        label: "Explore Features",
        onClick: onExploreFeatures,
        variant: "outline"
      } : undefined}
    />
  )
}

interface NotificationEmptyStateProps {
  onTurnOnNotifications?: () => void
}

export function NotificationEmptyState({ onTurnOnNotifications }: NotificationEmptyStateProps) {
  return (
    <EmptyState
      icon="🔔"
      title="You're all caught up!"
      description="No new notifications right now. We'll let you know when there are updates from your team."
      action={onTurnOnNotifications ? {
        label: "Notification Settings",
        onClick: onTurnOnNotifications,
        variant: "outline"
      } : undefined}
    />
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  onGoBack?: () => void
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We're having trouble loading this page. Please try again.", 
  onRetry, 
  onGoBack 
}: ErrorStateProps) {
  return (
    <EmptyState
      icon="⚠️"
      title={title}
      description={description}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
      secondaryAction={onGoBack ? {
        label: "Go Back",
        onClick: onGoBack
      } : undefined}
    />
  )
}