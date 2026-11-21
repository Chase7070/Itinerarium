'use client'

import { useUserMaps } from '@/contexts/map/UserMapsContext'
import { useRouter } from 'next/navigation'
import ProfilePanel from '@/components/pages/ProfilePanel'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Link from 'next/link'

export default function ProfilePage() {
  const { maps, isLoading, error } = useUserMaps()
  const router = useRouter()

  // filter out default maps (type is default), add safety check
  const defaultMaps = Array.isArray(maps)
    ? maps.filter(map => map && map.type === 'default')
    : [];

  // handle open map
  const handleOpenMap = (mapId: string) => {
    router.push(`/canvas/${mapId}`)
  }

  return (
    <ProtectedRoute>
      {/* {process.env.NODE_ENV !== 'production' && <MapDebugger />} */}

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Page title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Center</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account information and map collection</p>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main content area - divided into left and right columns */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">

              {/* Left content area - 70% width */}
              <div className="w-full md:w-[70%] bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Default Maps</h2>

                {defaultMaps.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No default maps yet</p>
                    <Link
                      href="/canvas/new"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create New Map
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {defaultMaps.map(map => (
                      <div
                        key={map.id || `map-${map.name}`}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => map.id && handleOpenMap(map.id)}
                      >
                        <h3 className="text-lg font-medium text-gray-800">{map.name}</h3>
                        {map.description && (
                          <p className="mt-2 text-sm text-gray-600">{map.description}</p>
                        )}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Created: {new Date(map.createdAt || '').toLocaleDateString()}
                          </span>
                          <button
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (map.id) handleOpenMap(map.id);
                            }}
                          >
                            Open →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* debug info - only show in development environment */}
                {/* {process.env.NODE_ENV !== 'production' && (
                  <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <details>
                      <summary className="cursor-pointer text-sm font-medium text-gray-700">Map Data Debug Info</summary>
                      <div className="mt-2">
                        <p className="text-xs">Total maps: {Array.isArray(maps) ? maps.length : 'No data'}</p>
                        <p className="text-xs">Default maps: {defaultMaps.length}</p>
                        <p className="text-xs">Loading state: {isLoading ? 'Loading' : 'Completed'}</p>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(defaultMaps, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )} */}
              </div>

              {/* Right content area - 30% width */}
              <div className="w-full md:w-[30%] bg-white rounded-lg shadow-sm p-6">
                <ProfilePanel />
              </div>

            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
