"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskBoard } from "@/components/tasks/task-board";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";
import { useData } from "@/contexts/DataContext";

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { searchTerms, setSearchTerm } = useData();

  const handleFilterChange = (type: "priority" | "dueDate", value: string) => {
    setShowFilters(true);
  };

  return (
    <div className="h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-10"
          value={searchTerms.tasks}
          onChange={(e) => setSearchTerm("tasks", e.target.value)}
        />
        {showFilters && <TaskFilters onFilterChange={handleFilterChange} />}
      </div>

      <TaskBoard />
      <CreateTaskDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
