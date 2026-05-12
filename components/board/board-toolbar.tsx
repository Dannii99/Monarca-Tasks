'use client'

import { Search, Plus, SlidersHorizontal, LogOut, ArrowUpDown, LayoutGrid, CheckCircle2, AlertCircle, Clock, Sun, Moon } from 'lucide-react'
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
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-default)] sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Monarca Tasks</h1>
              <p className="text-xs text-[var(--text-muted)]">{totalTasks} tareas en total</p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <Input
                placeholder="Buscar tareas..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[var(--bg-subtle)] border-[var(--border-default)] rounded-xl focus:bg-[var(--bg-surface)] focus:ring-4 focus:ring-[var(--color-active)]/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted ? (
              <button
                onClick={toggleTheme}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gray-100" />
            )}

            <Button
              onClick={onAddTask}
              className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Nueva tarea</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-10 w-10 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-t border-[var(--border-default)] bg-[var(--bg-subtle)]">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Stats Cards */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-work)]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[var(--color-work)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--text-primary)] leading-none">{pendingCount}</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Pendientes</p>
                </div>
              </div>

              {urgentCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--color-error)]/20 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-error)]/10 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--color-error)] leading-none">{urgentCount}</p>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Urgentes</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--text-primary)] leading-none">{doneCount}</p>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Completadas</p>
                </div>
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-2 sm:ml-auto">
              {/* Category Filters */}
<div className="flex items-center gap-1 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-default)]">
               {CATEGORIES.map((cat) => (
                 <button
                   key={cat.value}
                   onClick={() =>
                     onCategoryFilterChange(
                       categoryFilter === cat.value ? null : cat.value
                     )
                   }
                   className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                     categoryFilter === cat.value
                       ? 'bg-[var(--text-primary)] text-[var(--bg-surface)] shadow-sm'
                       : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                   }`}
                 >
                   {cat.label}
                 </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
<ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
               <select
                 value={sortBy}
                 onChange={(e) => onSortByChange(e.target.value)}
                 className="h-9 pl-9 pr-8 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl focus:border-[var(--color-active)] focus:ring-2 focus:ring-[var(--color-active)]/10 focus:outline-none appearance-none cursor-pointer hover:border-[var(--border-strong)] transition-colors"
               >
                 <option value="priority">Prioridad</option>
                 <option value="dueDate">Fecha</option>
                 <option value="name">Nombre</option>
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 h-9 px-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtros
                {(categoryFilter || sortBy !== 'priority') && (
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>
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
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border-default)] bg-[var(--bg-subtle)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                 <Input
                   placeholder="Buscar tareas..."
                   value={search}
                   onChange={(e) => onSearchChange(e.target.value)}
                   className="w-full h-11 pl-10 bg-[var(--bg-surface)] border-[var(--border-default)] rounded-xl"
                 />
              </div>

              {/* Mobile Category Filters */}
              <div>
<p className="text-xs font-medium text-[var(--text-muted)] mb-2">Categorías</p>
                 <div className="flex flex-wrap gap-2">
                   {CATEGORIES.map((cat) => (
                     <button
                       key={cat.value}
                       onClick={() =>
                         onCategoryFilterChange(
                           categoryFilter === cat.value ? null : cat.value
                         )
                       }
                       className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                         categoryFilter === cat.value
                           ? 'bg-[var(--text-primary)] text-[var(--bg-surface)]'
                           : 'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)]'
                       }`}
                     >
                       {cat.label}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Mobile Sort */}
              <div>
<p className="text-xs font-medium text-[var(--text-muted)] mb-2">Ordenar por</p>
                 <div className="relative">
                   <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                   <select
                     value={sortBy}
                     onChange={(e) => onSortByChange(e.target.value)}
                     className="w-full h-11 pl-10 pr-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-sm focus:border-[var(--color-active)] focus:outline-none appearance-none"
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
