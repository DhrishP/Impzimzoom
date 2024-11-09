"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { startOfDay, startOfWeek, startOfMonth, isWithinInterval } from "date-fns"

interface TaskFiltersProps {
  onFilterChange: (type: 'priority' | 'dueDate', value: string) => void
}

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex gap-2">
      <Select 
        defaultValue="all" 
        onValueChange={(value) => onFilterChange('priority', value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="HIGH">High Priority</SelectItem>
          <SelectItem value="MEDIUM">Medium Priority</SelectItem>
          <SelectItem value="LOW">Low Priority</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        defaultValue="all"
        onValueChange={(value) => onFilterChange('dueDate', value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Due Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Due Today</SelectItem>
          <SelectItem value="week">Due This Week</SelectItem>
          <SelectItem value="month">Due This Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}