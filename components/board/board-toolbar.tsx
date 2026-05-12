'use client'

import { Search, Plus, SlidersHorizontal, LogOut, ArrowUpDown, LayoutGrid, CheckCircle2, AlertCircle, Clock, Sun, Moon, Briefcase, Home, User, X } from 'lucide-react'
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
}

// Configuración de colores para categorías
const categoryStyles: Record<string, { icon: typeof Briefcase; color: string; bg: string; border: string }> = {
  WORK: { 
    icon: Briefcase, 
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20'
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
}: BoardToolbarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()

  const totalTasks = pendingCount + doneCount

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-default)] sticky top-0 z-20 shadow-sm">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              <LayoutGrid className="w-5 h-5 text-white relative z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Monarca Tasks</h1>
              <p className="text-xs text-[var(--text-muted)]">{totalTasks} tareas en total</p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--color-work)]" />
              <Input
                placeholder="Buscar tareas por título..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[var(--bg-subtle)] border-[var(--border-default)] rounded-xl focus:bg-[var(--bg-surface)] focus:border-[var(--color-work)] focus:ring-2 focus:ring-[var(--color-work)]/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-transparent hover:border-[var(--border-default)] transition-all duration-200"
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
              <div className="h-10 w-10 rounded-xl bg-[var(--bg-subtle)]" />
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onAddTask}
                className="h-10 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Nueva tarea</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-10 w-10 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats & Filters Bar */}
      <div className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)]/50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Stats Cards - Modern Design */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] leading-none">{pendingCount}</p>
                  <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mt-0.5">Pendientes</p>
                </div>
              </motion.div>

              {urgentCount > 0 && (
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-[var(--bg-surface)] rounded-2xl border border-red-200 dark:border-red-500/20 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 leading-none">{urgentCount}</p>
                    <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mt-0.5">Urgentes</p>
                  </div>
                </motion.div>
              )}

              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)] leading-none">{doneCount}</p>
                  <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mt-0.5">Completadas</p>
                </div>
              </motion.div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:ml-auto lg:flex-1 lg:justify-end">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-[var(--text-muted)] mr-1 hidden sm:inline">Filtrar:</span>
                {CATEGORIES.map((cat) => {
                  const styles = categoryStyles[cat.value]
                  const Icon = styles.icon
                  const isActive = categoryFilter === cat.value
                  
                  return (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCategoryFilterChange(isActive ? null : cat.value)}
                      className={`
                        relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                        transition-all duration-200 border
                        ${isActive 
                          ? `${styles.bg} ${styles.color} ${styles.border} shadow-sm ring-1 ring-inset ring-black/5` 
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-muted)] hover:border-[var(--border-strong)]'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-[var(--border-default)]" />

              {/* Sort Dropdown - Modern */}
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

              {/* Mobile Filter Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 h-10 px-3.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-all shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
                {(categoryFilter || sortBy !== 'priority' || search) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] text-white font-bold">
                    {(categoryFilter ? 1 : 0) + (sortBy !== 'priority' ? 1 : 0) + (search ? 1 : 0)}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search & Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-[var(--border-default)] bg-[var(--bg-subtle)] overflow-hidden"
          >
            <div className="px-4 py-5 space-y-5">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <Input
                  placeholder="Buscar tareas..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-12 pl-11 bg-[var(--bg-surface)] border-[var(--border-default)] rounded-xl text-sm"
                />
              </div>

              {/* Mobile Category Filters */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Filtrar por categoría</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const styles = categoryStyles[cat.value]
                    const Icon = styles.icon
                    const isActive = categoryFilter === cat.value
                    
                    return (
                      <button
                        key={cat.value}
                        onClick={() => onCategoryFilterChange(isActive ? null : cat.value)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold
                          transition-all duration-200 border
                          ${isActive 
                            ? `${styles.bg} ${styles.color} ${styles.border}` 
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-default)]'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                        {isActive && <X className="w-3.5 h-3.5 ml-1" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mobile Sort */}
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Ordenar por</p>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <select
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-sm font-medium focus:border-[var(--color-work)] focus:outline-none appearance-none"
                  >
                    <option value="priority">Prioridad</option>
                    <option value="dueDate">Fecha</option>
                    <option value="name">Nombre</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
