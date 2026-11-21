'use client'

import { getErrorMessage } from '@/utils/errorMessage';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth/AuthContext'
import Link from 'next/link'
import { userApi } from '@/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const router = useRouter()
  const { setToken } = useAuth()

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const result = await userApi.login({ email, password })
      console.log('Login API Response:', result)

      if (!result.token) {
        throw new Error('Login response missing token')
      }

      setToken(result.token)
      router.push('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(getErrorMessage(err, 'Login request failed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isPageLoaded) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 pt-16 px-4">
      <div className="w-full max-w-md p-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg animate-fadeInUp">
        <div className="bg-gray-900 rounded-[14px] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your travel planner account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-[#050e29] text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-colors duration-200 outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-600/30 bg-[#050e29] text-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-colors duration-200 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
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
                  Processing...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center mt-6 text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
