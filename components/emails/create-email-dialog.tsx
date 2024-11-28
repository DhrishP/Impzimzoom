"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
});

type FormData = z.infer<typeof formSchema>;

export function CreateEmailDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addData } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
    },
  });

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
      // Handle Enter key
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
      // Handle arrow down for input navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const inputs = document.querySelectorAll('input, select, textarea');
        const currentElement = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element);
        const nextElement = inputs[currentIndex + 1];
        if (nextElement) {
          (nextElement as HTMLElement).focus();
        }
      }
      // Handle arrow up for input navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const inputs = document.querySelectorAll('input, select, textarea');
        const currentElement = document.activeElement;
        const currentIndex = Array.from(inputs).indexOf(currentElement as Element);
        const prevElement = inputs[currentIndex - 1];
        if (prevElement) {
          (prevElement as HTMLElement).focus();
        }
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await addData("emails", data);
      onOpenChange(false);
      form.reset();
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Email Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="Write your email template..."
                className="h-[200px]"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
