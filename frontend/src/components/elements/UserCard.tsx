'use client'

import { useAuth } from '@/contexts/auth/AuthContext'

export default function UserCard() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || !user) return null // if not logged in, return nothing

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: 20,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      maxWidth: 400,
      margin: '20px auto'
    }}>
      {/* avatar preview */}
      <img
        src={`http://localhost:3001${user.avatar}`}
        alt="Avatar"
        width={80}
        style={{ borderRadius: '50%' }}
      />

      <div>
        <h3 style={{ margin: 0 }}>{user.username}</h3>
        <p style={{ margin: 0, fontSize: 14 }}>{user.email}</p>
      </div>
    </div>
  )
}