'use client'

import AuthBackground from '@/components/pages/AuthBackground'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </AuthBackground>
  )
}