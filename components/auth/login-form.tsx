'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: process.env.NEXT_PUBLIC_DEMO_EMAIL || 'demo@monarca.co',
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'monarca123',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Monarca Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Acceso demo</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Email: <span className="font-mono">demo@monarca.co</span>
                </p>
                <p className="text-xs text-blue-700">
                  Contraseña: <span className="font-mono">monarca123</span>
                </p>
              </div>
              <Button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {loading ? 'Entrando...' : 'Entrar como demo'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
