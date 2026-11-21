'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth/AuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// protected route wrapper component, can wrap any page that needs authentication
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('not logged in, redirect to login page')
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // show loading status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-indigo-500">verifying login status...</p>
      </div>
    )
  }

  // show not logged in status (if fallback component is provided)
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>
  }

  // show not logged in status (default)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-500">not logged in, redirecting to login page...</p>
      </div>
    )
  }

  // already logged in, show child component
  return <>{children}</>
}
