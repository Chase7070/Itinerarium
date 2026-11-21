'use client'

import Image from 'next/image';
import { getErrorMessage } from '@/utils/errorMessage';
import { useAuth } from '@/contexts/auth/AuthContext'
import { useUserMaps } from '@/contexts/map/UserMapsContext' // Ensure MapData type expects _id and createdAt
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserAvatarUrl } from '@/utils/imageUtils'
import { Map } from "@/types/common/index";

export default function ProfilePanel() {
  const { user } = useAuth()
  const {
    maps,
    deleteMap: contextDeleteMap,
    createMap: contextCreateMap,
    // fetchMaps // Available if needed for a fallback
  } = useUserMaps()

  const router = useRouter() // Initialize router

  const [deleteMode, setDeleteMode] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null) // Used for delete and creation errors for now
  const [isCreating, setIsCreating] = useState(false)
  const [localMaps, setLocalMaps] = useState<Map[]>([])

  useEffect(() => {
    if (maps) {
      setLocalMaps([...maps]) // Create a local copy
    }
  }, [maps])

  // Sort maps by creation date, prioritizing 'createdAt'
  // Ensure MapData objects have 'createdAt' (or 'created_at') and '_id'.
  const sortedMaps = [...localMaps]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA // Sort descending (newest first)
    })
    // .slice(0, 8) // Display up to 8 maps

  // --- Handle Delete Map ---
  const handleDeleteMap = async (mapId: string, isDefault: boolean) => {
    setDeleteError(null)

    if (isDefault) {
      setDeleteError("Default maps cannot be deleted.")
      setTimeout(() => setDeleteError(null), 3000)
      return
    }

    if (!mapId) {
      console.error("ProfilePanel: handleDeleteMap called with undefined mapId.")
      setDeleteError("Cannot delete map: Map ID is missing.")
      return
    }

    try {
      await contextDeleteMap(mapId)
      console.log(
        `ProfilePanel: Map with ID ${mapId} deletion initiated via context.`
      )
      // UI should update automatically as `maps` from context changes,
      // triggering the useEffect to update `localMaps`.
    } catch (error) {
      console.error("ProfilePanel: Failed to delete map.", error)
      const message =
        getErrorMessage(error, "Failed to delete map.")
      setDeleteError(message)
      setTimeout(() => setDeleteError(null), 3000)
    }
  }

  // --- Handle Create New Map ---
  const handleCreateMap = async () => {
    if (isCreating) {
      return
    }
    setIsCreating(true)
    setDeleteError(null) // Clear previous errors

    try {
      const newMap = await contextCreateMap({
        name: "New Creation",
        description: "This is a new creation",
        type: "shareable",
      })

      console.log(
        "ProfilePanel: Map object DIRECTLY received from contextCreateMap:",
        JSON.stringify(newMap, null, 2)
      )

      if (newMap && newMap.id && newMap.createdAt) {
        console.log(
          `ProfilePanel: New map created successfully. ID: ${newMap.id}. Navigating to canvas...`
        )
        router.push(`/canvas/${newMap.id}`)
      } else {
        console.warn(
          "ProfilePanel: The new map object received from contextCreateMap is incomplete or malformed. " +
          "It's missing `_id` or `createdAt`, or the object itself is null/undefined. " +
          "Navigation will be aborted. Please inspect the logged 'newMap' object above.",
          newMap
        )
        setDeleteError( // Or a specific creationError state
          "Map created, but there was an issue with its data. Navigation aborted."
        )
      }
    } catch (error) {
      console.error(
        "ProfilePanel: An error occurred during map creation via contextCreateMap:",
        error
      )
      const errorMessage =
        getErrorMessage(error, "An unexpected error occurred while creating the map.")
      setDeleteError(errorMessage) // Or a specific creationError state
    } finally {
      setIsCreating(false)
    }
  }

  if (!user) {
    return null // Or a loading spinner/placeholder
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 shadow-lg rounded-lg">
      {/* User profile section */}
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <Image unoptimized width={64} height={64}
              src={getUserAvatarUrl(user.avatar)}
              alt={user.username || 'User Avatar'}
              className="w-full h-full object-cover"
              onError={(e) => {
                ; (e.target as HTMLImageElement).src =
                  '/assets/default-avatar.png' // Ensure this path is correct
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-indigo-500">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user.username || 'User'}
          </h3>
          <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
        </div>
      </div>

      {/* Map creations section */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Your Map Creations
        </h3>

        {deleteError && ( // Display errors here
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {deleteError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-4 max-h-96 overflow-y-auto">
          {sortedMaps.map((map) => (
            // --- CRUCIAL CHANGE: Use map._id for the key ---
            <div key={map.id} className="relative group">
              <div
                className={`h-28 rounded-lg border flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md ${map.type === 'default'
                  ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                  : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                  }`}
                onClick={() => {
                  if (map.id) {
                    router.push(`/canvas/${map.id}`)
                  } else {
                    console.error("ProfilePanel: Cannot navigate, map._id is missing for map:", map.name, map);
                    setDeleteError("Cannot open map: Map ID is missing.");
                  }
                }}
              >
                <span className="text-base font-medium text-gray-700 truncate px-2 text-center block w-full">
                  {map.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {/* Ensure map.createdAt is valid, fallback to empty string if not */}
                  {new Date(map.createdAt || '').toLocaleDateString()}
                </span>
                {map.type === 'default' && (
                  <span className="absolute top-2 left-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                    Default
                  </span>
                )}
              </div>

              {deleteMode && map.type !== 'default' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Prevent card click
                    if (map.id) {
                      handleDeleteMap(map.id, map.type === 'default')
                    } else {
                      console.error(
                        "ProfilePanel: Attempted to delete map without an _id:",
                        map
                      )
                      setDeleteError("Cannot delete: Map ID is missing.")
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete map"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {sortedMaps.length === 0 && !isCreating && (
            <p className="text-sm text-gray-500 col-span-full text-center py-4">
              You haven&apos;t created any maps yet.
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${deleteMode
            ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
            }`}
        >
          {deleteMode ? 'Cancel Deletion' : 'Manage Maps'}
        </button>
        <button
          onClick={handleCreateMap}
          disabled={isCreating}
          className={`w-full sm:w-auto px-4 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isCreating
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:bg-indigo-700'
            }`}
        >
          {isCreating ? 'Creating Map...' : 'Create New Map'}
        </button>
      </div>
    </div>
  )
}