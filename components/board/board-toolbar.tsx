'use client'

import { Search, Plus, SlidersHorizontal, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/constants'

interface BoardToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string | null
  onCategoryFilterChange: (value: string | null) => void
  sortBy: string
  onSortByChange: (value: string) => void
  onAddTask: () => void
  onLogout: () => void
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
}: BoardToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Monarca Tasks</h1>
        </div>

        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={categoryFilter === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  onCategoryFilterChange(
                    categoryFilter === cat.value ? null : cat.value
                  )
                }
                className="text-xs"
              >
                {cat.label}
              </Button>
            ))}
            {categoryFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryFilterChange(null)}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="h-8 rounded-sm border border-gray-300 bg-transparent px-2 text-xs focus:border-blue-600 focus:outline-none"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="name">Name</option>
            </select>
          </div>

          <Button onClick={onAddTask} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
