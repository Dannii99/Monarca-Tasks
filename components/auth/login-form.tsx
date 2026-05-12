'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'

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
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: 'demo@monarca.co',
        password: 'monarca123',
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <Card className="w-full border-0 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <CardHeader className="pb-6 pt-8 text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Bienvenido
              </h1>
              <p className="text-sm text-gray-500">
                Inicia sesión para continuar con Monarca Tasks
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="h-12 pl-11 pr-4 text-sm bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </Field>
              
              <Field className="space-y-2">
                <FieldLabel htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 pl-11 pr-4 text-sm bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </Field>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Entrar
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400">o</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Modo demo</h3>
                  <p className="text-xs text-gray-500">Prueba la aplicación sin registro</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">Email:</span>
                  <code className="px-2 py-1 bg-white rounded-md text-gray-700 font-mono border border-gray-200">
                    demo@monarca.co
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-16">Pass:</span>
                  <code className="px-2 py-1 bg-white rounded-md text-gray-700 font-mono border border-gray-200">
                    monarca123
                  </code>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                disabled={loading}
                variant="outline"
                className="w-full h-11 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200"
              >
                Entrar como invitado
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center text-xs text-gray-400"
      >
        Al iniciar sesión, aceptas nuestros términos de servicio
      </motion.p>
    </div>
  )
}
