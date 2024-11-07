"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Pencil, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Task } from "@prisma/client"
import { Button } from "@/components/ui/button"
import EditTaskDialog from "./edit-task-dialog"

const statusColumns = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
]

export function TaskBoard() {
  const { tasks, loading, refreshData, deleteData, searchTerms } = useData()
  const { toast } = useToast()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    refreshData('tasks')
  }, [refreshData])

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerms.tasks.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerms.tasks.toLowerCase())
  )

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

  const handleDelete = async (id: string) => {
    try {
      await deleteData("tasks", id)
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  if (loading.tasks) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => (
        <div key={column.id} className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">{column.label}</h3>
          {filteredTasks
            .filter((task) => task.status === column.id)
            .map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  {task.dueDate && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {formatDistanceToNow(new Date(task.dueDate))} ago
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      ))}
      
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}