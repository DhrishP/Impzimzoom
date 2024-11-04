"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const mockTasks = [
  {
    id: "1",
    title: "Update Portfolio",
    description: "Add recent projects and update skills section",
    status: "TODO",
    priority: "HIGH",
    dueDate: new Date("2024-04-01"),
  },
  {
    id: "2",
    title: "Prepare Presentation",
    description: "Create slides for the client meeting",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: new Date("2024-03-25"),
  },
]

const statusColumns = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
]

export function TaskBoard() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500 bg-red-50"
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-50"
      case "LOW":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => (
        <div key={column.id} className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">{column.label}</h3>
          {mockTasks
            .filter((task) => task.status === column.id)
            .map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition cursor-pointer">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due {formatDistanceToNow(task.dueDate)} ago
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      ))}
    </div>
  )
}