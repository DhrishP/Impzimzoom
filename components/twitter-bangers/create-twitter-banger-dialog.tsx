"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  content: z.string().min(1, "Content is required").max(280, "Content must be less than 280 characters"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Must be a valid URL").or(z.string().length(0)),
  tags: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateTwitterBangerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addData } = useData();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      category: "",
      imageUrl: "",
      tags: "",
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
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
    try {
      const formattedData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      
      await addData("twitterBangers", formattedData);
      onOpenChange(false);
      form.reset();
      toast({
        title: "Success",
        description: "Twitter banger created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create twitter banger",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Twitter Banger</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="Write your tweet..."
                className="h-[100px]"
              />
              <div className="flex justify-between">
                <div>
                  {form.formState.errors.content && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {form.watch("content")?.length || 0}/280
                </div>
              </div>
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
                  <SelectItem value="TECH">Tech</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
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
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                {...form.register("imageUrl")}
                placeholder="Enter image URL"
              />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...form.register("tags")}
                placeholder="tech, programming, web3"
              />
              {form.formState.errors.tags && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Tweet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 