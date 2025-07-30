import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn(
        'border-2 border-gray-200 border-t-monday-blue rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
    />
  )
}

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

interface BoardSkeletonProps {
  count?: number
}

export function BoardSkeleton({ count = 3 }: BoardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

interface DashboardSkeletonProps {}

export function DashboardSkeleton({}: DashboardSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="animate-pulse">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse flex items-center">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Work Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="animate-pulse">
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="p-6">
            <div className="animate-pulse text-center py-8">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-4 w-48 mx-auto mb-2" />
              <Skeleton className="h-3 w-64 mx-auto" />
            </div>
          </div>
        </div>

        {/* Workspaces Skeleton */}
        <div className="space-y-6">
          <div className="animate-pulse flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <div className="flex space-x-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="animate-pulse flex items-center justify-between">
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
            <div className="p-6">
              <BoardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ message = 'Loading...', size = 'md', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}

interface FullPageLoadingProps {
  message?: string
}

export function FullPageLoading({ message = 'Loading your workspace...' }: FullPageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}