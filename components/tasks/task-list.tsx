 "use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Task } from "@prisma/client"
import EditTaskDialog from "@/components/tasks/edit-task-dialog"

const priorityColors = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "secondary",
} as const

const statusColors = {
  TODO: "secondary",
  IN_PROGRESS: "warning",
  DONE: "success",
} as const

export function TaskList() {
  const { tasks, loading, refreshData, deleteData } = useData()
  const { toast } = useToast()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    refreshData('tasks')
  }, [refreshData])

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
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{task.title}</h3>
                <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority}
                </Badge>
                <Badge variant={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              {task.dueDate && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due {format(new Date(task.dueDate), "PPP")}</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2 ml-4">
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
          <div className="mt-4 text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(task.updatedAt))} ago
          </div>
        </Card>
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