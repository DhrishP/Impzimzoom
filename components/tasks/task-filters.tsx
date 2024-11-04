"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TaskFilters() {
  return (
    <div className="flex gap-2">
      <Select defaultValue="all">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all">
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