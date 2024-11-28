"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
})

type FormData = z.infer<typeof formSchema>

export function CreateTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addData } = useData()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      status: "TODO",
      dueDate: new Date(),
    },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        form.handleSubmit(onSubmit)()
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        const inputs = document.querySelectorAll('input, select, textarea')
        const currentElement = document.activeElement
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element)
        const nextElement = inputs[currentIndex + 1]
        if (nextElement) {
          (nextElement as HTMLElement).focus()
        }
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        const inputs = document.querySelectorAll('input, select, textarea')
        const currentElement = document.activeElement
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element)
        const prevElement = inputs[currentIndex - 1]
        if (prevElement) {
          (prevElement as HTMLElement).focus()
        }
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, form])

  const onSubmit = async (data: FormData) => {
    try {
      await addData("tasks", data)
      onOpenChange(false)
      form.reset()
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter task title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter task description"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) => form.setValue("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("dueDate") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dueDate") ? (
                      format(form.watch("dueDate"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("dueDate")}
                    onSelect={(date) => form.setValue("dueDate", date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dueDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}