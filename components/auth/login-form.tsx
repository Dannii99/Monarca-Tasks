'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, AlertTriangle, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { useTheme } from '@/components/theme-provider'

// Validaciones de seguridad
const VALIDATION = {
  email: {
    maxLength: 254, // RFC 5321
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    sanitize: (value: string): string => {
      return value
        .toLowerCase()
        .trim()
        .replace(/[<>'\\;]/g, '') // Eliminar caracteres peligrosos
        .slice(0, 254)
    }
  },
  password: {
    maxLength: 128,
    minLength: 1,
    sanitize: (value: string): string => {
      // Permitir la mayoría de caracteres pero eliminar control characters
      return value
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Eliminar control characters
        .slice(0, 128)
    }
  }
}

export function LoginForm() {
  const router = useRouter()
  const { theme, toggleTheme, mounted } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateEmail = (value: string): boolean => {
    if (value.length > VALIDATION.email.maxLength) {
      setErrors(prev => ({ ...prev, email: `Máximo ${VALIDATION.email.maxLength} caracteres` }))
      return false
    }
    if (value && !VALIDATION.email.pattern.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Formato de email inválido' }))
      return false
    }
    setErrors(prev => ({ ...prev, email: undefined }))
    return true
  }

  const validatePassword = (value: string): boolean => {
    if (value.length > VALIDATION.password.maxLength) {
      setErrors(prev => ({ ...prev, password: `Máximo ${VALIDATION.password.maxLength} caracteres` }))
      return false
    }
    setErrors(prev => ({ ...prev, password: undefined }))
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleEmailBlur = () => {
    const sanitized = VALIDATION.email.sanitize(email)
    if (sanitized !== email) {
      setEmail(sanitized)
    }
  }

  const handlePasswordBlur = () => {
    const sanitized = VALIDATION.password.sanitize(password)
    if (sanitized !== password) {
      setPassword(sanitized)
    }
  }

  // Prevenir pegar contenido malicioso
  const handlePaste = (e: React.ClipboardEvent, type: 'email' | 'password') => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const sanitized = type === 'email'
      ? VALIDATION.email.sanitize(pastedText)
      : VALIDATION.password.sanitize(pastedText)
    
    if (type === 'email') {
      setEmail(sanitized)
      validateEmail(sanitized)
    } else {
      setPassword(sanitized)
      validatePassword(sanitized)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validación final
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)

    // Sanitizar antes de enviar
    const sanitizedEmail = VALIDATION.email.sanitize(email)
    const sanitizedPassword = VALIDATION.password.sanitize(password)

    try {
      const result = await signIn('credentials', {
        email: sanitizedEmail,
        password: sanitizedPassword,
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
      {/* Toggle de tema */}
      <div className="flex justify-end mb-4">
        {mounted ? (
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 shadow-sm"
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm">
            <div className="w-5 h-5" />
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <Card className="w-full border-0 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <CardHeader className="pb-6 pt-8 text-center space-y-3 bg-[var(--bg-surface)]">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-100 border border-gray-200 flex items-center justify-center shadow-lg">
              <Image src="/monarca.png" alt="Monarca Tasks" width={48} height={48} className="w-12 h-12 object-contain" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Bienvenido
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Inicia sesión para continuar con Monarca Tasks
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-8 bg-[var(--bg-surface)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">
                  Correo electrónico
                </FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    onPaste={(e) => handlePaste(e, 'email')}
                    placeholder="tu@email.com"
                    required
                    maxLength={VALIDATION.email.maxLength}
                    autoComplete="email"
                    autoCorrect="off"
                    spellCheck="false"
                    className={`h-12 pl-11 pr-4 text-sm bg-[var(--bg-subtle)] rounded-xl transition-all duration-200 placeholder:text-[var(--text-muted)] border ${
                      errors.email 
                        ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-4 focus:ring-[var(--color-error)]/10' 
                        : 'border-[var(--border-default)] focus:bg-[var(--bg-surface)] focus:border-[var(--color-active)] focus:ring-4 focus:ring-[var(--color-active)]/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>Formato: usuario@dominio.com</span>
                  <span>{email.length}/{VALIDATION.email.maxLength}</span>
                </div>
              </Field>
              
              {/* Password */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="password" className="text-sm font-medium text-[var(--text-secondary)]">
                  Contraseña
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    onPaste={(e) => handlePaste(e, 'password')}
                    placeholder="••••••••"
                    required
                    maxLength={VALIDATION.password.maxLength}
                    autoComplete="current-password"
                    className={`h-12 pl-11 pr-12 text-sm bg-[var(--bg-subtle)] rounded-xl transition-all duration-200 placeholder:text-[var(--text-muted)] border ${
                      errors.password 
                        ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-4 focus:ring-[var(--color-error)]/10' 
                        : 'border-[var(--border-default)] focus:bg-[var(--bg-surface)] focus:border-[var(--color-active)] focus:ring-4 focus:ring-[var(--color-active)]/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </div>
                )}
                <p className="text-xs text-[var(--text-muted)]">
                  Máximo {VALIDATION.password.maxLength} caracteres
                </p>
              </Field>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-[var(--color-error)]/10 px-4 py-3 rounded-xl"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <Button
                type="submit"
                disabled={loading || Object.keys(errors).some(k => errors[k as keyof typeof errors])}
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
                <div className="w-full border-t border-[var(--border-default)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--bg-surface)] px-4 text-[var(--text-muted)]">o</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white to-gray-100 border border-gray-200 flex items-center justify-center">
                  <Image src="/monarca.png" alt="Monarca" width={32} height={32} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Modo demo</h3>
                  <p className="text-xs text-[var(--text-muted)]">Prueba la aplicación sin registro</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)] w-16">Email:</span>
                  <code className="px-2 py-1 bg-[var(--bg-subtle)] rounded-md text-[var(--text-secondary)] font-mono border border-[var(--border-default)]">
                    demo@monarca.co
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)] w-16">Contraseña:</span>
                  <code className="px-2 py-1 bg-[var(--bg-subtle)] rounded-md text-[var(--text-secondary)] font-mono border border-[var(--border-default)]">
                    monarca123
                  </code>
                </div>
              </div>

              <Button
                onClick={handleDemoLogin}
                disabled={loading}
                variant="outline"
                className="w-full h-11 text-sm font-medium border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] rounded-xl transition-all duration-200"
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
        className="mt-6 text-center text-xs text-[var(--text-muted)]"
      >
        Al iniciar sesión, aceptas nuestros términos de servicio
      </motion.p>
    </div>
  )
}
