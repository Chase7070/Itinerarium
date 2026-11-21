'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth/AuthContext'
import AvatarUploader from '@/components/elements/AvatarUploader'
import Link from 'next/link'
import { userApi } from '@/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const router = useRouter()
  const { setToken } = useAuth()

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const handleRegister = async () => {
    setError('')
    setIsLoading(true)

    try {
      const result = await userApi.register({ email, username, password, avatar })
      console.log('Register API Response:', result)

      if (!result.token) {
        throw new Error('Registration response missing token')
      }

      setToken(result.token)
      router.push('/')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || err.message || 'Registration request failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isPageLoaded) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-16 px-4">
      <div className="w-full max-w-md p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg animate-fadeInUp">
        <div className="bg-gray-900 rounded-[14px] p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-300">Join our travel planning community</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-[#050e29] text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-colors duration-200 outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-[#050e29] text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-colors duration-200 outline-none"
                placeholder="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-[#050e29] text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-colors duration-200 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-white mb-2"> Avatar</label>
              <div className="bg-[#050e29] p-4 rounded-lg border border-indigo-600/30 text-white">
                <AvatarUploader onUpload={setAvatar} />
              </div>
              {avatar && (
                <p className="mt-2 text-xs text-gray-400 truncate text-white">
                  Selected: {avatar}
                </p>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>

            <div className="text-center mt-6 text-sm text-gray-400">
              Already have an account?
              <Link
                href="/login"
                className="ml-1 font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
