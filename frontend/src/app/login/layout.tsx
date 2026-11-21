'use client'

import AuthBackground from '@/components/pages/AuthBackground'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBackground>
      {children}
    </AuthBackground>
  )
}