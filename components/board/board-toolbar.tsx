'use client'

import { Search, Plus, SlidersHorizontal, LogOut, ArrowUpDown, CheckCircle2, AlertCircle, Clock, Sun, Moon, Briefcase, Home, User, X, LayoutGrid, Hand } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/constants'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTheme } from '@/components/theme-provider'

interface BoardToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string | null
  onCategoryFilterChange: (value: string | null) => void
  sortBy: string
  onSortByChange: (value: string) => void
  onAddTask: () => void
  onLogout: () => void
  pendingCount: number
  urgentCount: number
  doneCount: number
  userName: string
  userEmail: string
}

// Configuración de colores para categorías
const categoryStyles: Record<string, { icon: typeof Briefcase; color: string; bg: string; border: string }> = {
  WORK: { 
    icon: Briefcase, 
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    border: 'border-orange-200 dark:border-orange-500/20'
  },
  HOME: { 
    icon: Home, 
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20'
  },
  PERSONAL: { 
    icon: User, 
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20'
  },
}

export function BoardToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  onAddTask,
  onLogout,
  pendingCount,
  urgentCount,
  doneCount,
  userName,
  userEmail,
}: BoardToolbarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  const totalTasks = pendingCount + doneCount
  
  // Obtener hora actual para el saludo
  const currentHour = new Date().getHours()
  let greeting = 'Buenos días'
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Buenas tardes'
  } else if (currentHour >= 18) {
    greeting = 'Buenas noches'
  }

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-default)] sticky top-0 z-20 shadow-sm">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <Image 
                src="/monarca.png" 
                alt="Monarca Tasks Logo" 
                width={40} 
                height={40}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base lg:text-lg font-bold text-[var(--text-primary)] tracking-tight">Monarca Tasks</h1>
              <p className="text-xs text-[var(--text-muted)]">{totalTasks} tareas</p>
            </div>
            {/* En móvil solo mostrar el título sin subtítulo */}
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-[var(--text-primary)]">Monarca</h1>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--color-work)]" />
              <Input
                placeholder="Buscar tareas..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[var(--bg-subtle)] border-[var(--border-default)] rounded-xl focus:bg-[var(--bg-surface)] focus:border-[var(--color-work)] focus:ring-2 focus:ring-[var(--color-work)]/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            {mounted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-transparent hover:border-[var(--border-default)] transition-all duration-200"
                aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </motion.button>
            ) : (
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--bg-subtle)]" />
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onAddTask}
                className="h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-[#ed7a28] to-[#FF5722] hover:from-[#d86a1f] hover:to-[#e64a19] text-white rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 font-medium text-sm"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Nueva tarea</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-9 w-9 sm:h-10 sm:w-10 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Logout - Visible solo en móvil */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-9 w-9 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Professional Hero Section */}
      <div className="border-t border-[var(--border-default)] bg-gradient-to-br from-[var(--bg-surface)] via-[var(--bg-subtle)] to-[var(--bg-surface)]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            
            {/* Left: Greeting & Welcome */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs sm:text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  {greeting}
                </p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] truncate">
                  {userName}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 truncate">
                  {userEmail || 'Usuario invitado'}
                </p>
              </motion.div>
            </div>

            {/* Center/Right: Stats Cards Grid */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide p-2">
              {/* Total Tasks */}
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--stat-bg)] rounded-xl border border-[var(--stat-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--stat-total-icon-from), var(--stat-total-icon-to))' }}>
                  <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold leading-none" style={{ color: 'var(--stat-total-text)' }}>{totalTasks}</p>
                  <p className="text-[10px] sm:text-xs text-[var(--stat-text-secondary)] uppercase tracking-wide font-medium mt-0.5">Total tareas</p>
                </div>
              </motion.div>

              {/* Pendientes */}
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--stat-bg)] rounded-xl border border-[var(--stat-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--stat-pending-icon-from), var(--stat-pending-icon-to))' }}>
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold leading-none" style={{ color: 'var(--stat-pending-text)' }}>{pendingCount}</p>
                  <p className="text-[10px] sm:text-xs text-[var(--stat-text-secondary)] uppercase tracking-wide font-medium mt-0.5">Pendientes</p>
                </div>
              </motion.div>

              {/* Urgentes - Solo si hay */}
              {urgentCount > 0 && (
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--stat-bg)] rounded-xl border border-[var(--stat-border)] shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--stat-urgent-icon-from), var(--stat-urgent-icon-to))' }}>
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold leading-none" style={{ color: 'var(--stat-urgent-text)' }}>{urgentCount}</p>
                    <p className="text-[10px] sm:text-xs text-[var(--stat-text-secondary)] uppercase tracking-wide font-medium mt-0.5">Urgentes</p>
                  </div>
                </motion.div>
              )}

              {/* Completadas */}
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-[var(--stat-bg)] rounded-xl border border-[var(--stat-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--stat-done-icon-from), var(--stat-done-icon-to))' }}>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold leading-none" style={{ color: 'var(--stat-done-text)' }}>{doneCount}</p>
                  <p className="text-[10px] sm:text-xs text-[var(--stat-text-secondary)] uppercase tracking-wide font-medium mt-0.5">Completadas</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)]/50 backdrop-blur-sm">
        <div className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Filters Section - Desktop Only */}
            <div className="hidden sm:flex flex-row items-center gap-2 lg:ml-auto lg:flex-1 lg:justify-end">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-[var(--text-muted)] mr-1 hidden lg:inline">Filtrar:</span>
                {CATEGORIES.map((cat) => {
                  const styles = categoryStyles[cat.value]
                  const Icon = styles.icon
                  const isActive = categoryFilter === cat.value
                  
                  return (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCategoryFilterChange(isActive ? null : cat.value)}
                      className={`
                        relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                        transition-all duration-200 border
                        ${isActive 
                          ? `${styles.bg} ${styles.color} ${styles.border} shadow-sm ring-1 ring-inset ring-black/5` 
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-muted)]'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      {isActive && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <X className="w-3 h-3 ml-0.5" />
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-[var(--border-default)]" />

              {/* Sort Dropdown */}
              <div className="relative min-w-[140px]">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl focus:border-[var(--color-work)] focus:ring-2 focus:ring-[var(--color-work)]/10 focus:outline-none appearance-none cursor-pointer hover:border-[var(--border-strong)] transition-all shadow-sm"
                >
                  <option value="priority">Por prioridad</option>
                  <option value="dueDate">Por fecha</option>
                  <option value="name">Por nombre</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle - Only visible on mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-1.5 h-9 px-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all shadow-sm ml-auto"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {(categoryFilter || sortBy !== 'priority' || search) && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#ed7a28] to-[#FF5722] text-[9px] text-white font-bold">
                  {(categoryFilter ? 1 : 0) + (sortBy !== 'priority' ? 1 : 0) + (search ? 1 : 0)}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Search & Filters - Fixed Full Screen */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="sm:hidden fixed inset-0 z-50 bg-[var(--bg-base)] flex flex-col"
          >
            {/* Header del panel */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border-default)] bg-[var(--bg-surface)] flex-shrink-0">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Filtros</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileFilters(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-muted)]">
                  <Search className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <Input
                  placeholder="Buscar tareas..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-14 pl-16 pr-4 bg-[var(--bg-surface)] border-[var(--border-default)] rounded-2xl text-base font-medium"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-default)]" />

              {/* Mobile Category Filters */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Filtrar por categoría</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const styles = categoryStyles[cat.value]
                    const Icon = styles.icon
                    const isActive = categoryFilter === cat.value
                    
                    return (
                      <button
                        key={cat.value}
                        onClick={() => onCategoryFilterChange(isActive ? null : cat.value)}
                        className={`
                          flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-sm font-semibold
                          transition-all duration-200 border-2 min-h-[80px]
                          ${isActive 
                            ? `${styles.bg} ${styles.color} ${styles.border} shadow-md` 
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)]'
                          }
                        `}
                      >
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${isActive ? 'bg-white/50' : 'bg-[var(--bg-muted)]'}
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span>{cat.label}</span>
                        {isActive && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--text-primary)] flex items-center justify-center">
                            <X className="w-3 h-3 text-[var(--bg-surface)]" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-default)]" />

              {/* Mobile Sort */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-muted)] flex items-center justify-center">
                    <ArrowUpDown className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Ordenar por</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'priority', label: 'Prioridad', icon: AlertCircle },
                    { value: 'dueDate', label: 'Fecha', icon: Clock },
                    { value: 'name', label: 'Nombre', icon: LayoutGrid },
                  ].map((option) => {
                    const Icon = option.icon
                    const isActive = sortBy === option.value
                    return (
                      <button
                        key={option.value}
                        onClick={() => onSortByChange(option.value)}
                        className={`
                          flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-sm font-semibold
                          transition-all duration-200 border-2 min-h-[80px]
                          ${isActive 
                            ? 'bg-[var(--color-work)]/10 text-[var(--color-work)] border-[var(--color-work)]/30 shadow-md' 
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)]'
                          }
                        `}
                      >
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${isActive ? 'bg-[var(--color-work)]/20' : 'bg-[var(--bg-muted)]'}
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span>{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-default)]" />

            </div>

            {/* Botón fijo en la parte inferior */}
            <div className="flex-shrink-0 p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] safe-area-pb">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMobileFilters(false)}
                className="w-full h-12 bg-[var(--color-work)] hover:bg-[var(--color-active)] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                Aplicar filtros
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
