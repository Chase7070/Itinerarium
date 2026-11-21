'use client'

import { useAuth } from '@/contexts/auth/AuthContext'
import { useUserMaps } from '@/contexts/map/UserMapsContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CanvasIndexPage() {
  const { user } = useAuth()
  const { maps, fetchMaps } = useUserMaps()
  const router = useRouter()

  useEffect(() => {
    // get maps data (if not fetched)
    if (user && (!maps || maps.length === 0)) {
      console.log('Fetching maps in canvas index page')
      fetchMaps()
    }
  }, [user, maps, fetchMaps])

  // find default map and redirect
  useEffect(() => {
    if (!maps || maps.length === 0) return

    console.log('Canvas index - finding default map')
    const defaultMap = maps.find(map => map.type === 'default')
    
    if (defaultMap) {
      const defaultMapId = defaultMap.id 
      console.log('Redirecting to default map:', defaultMapId)
      router.replace(`/canvas/${defaultMapId}`)
    } else {
      console.log('No default map found, redirecting to profile')
      router.replace('/me')
    }
  }, [maps, router])

  return (
    <ProtectedRoute>
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading your canvas...</h1>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </ProtectedRoute>
  )
}