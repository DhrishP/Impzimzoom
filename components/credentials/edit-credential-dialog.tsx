"use client";

import { useState } from "react";
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
import { Credential } from "@prisma/client";

interface EditCredentialDialogProps {
  credential: Credential;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditCredentialDialog({
  credential,
  open,
  onOpenChange,
}: EditCredentialDialogProps) {
  const { updateData } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: credential.title,
    username: credential.username,
    password: credential.password,
    url: credential.url,
    notes: credential.notes,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateData("credentials", credential.id, formData);
      toast({
        title: "Success",
        description: "Credential updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update credential",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter credential title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL (optional)</Label>
            <Input
              id="url"
              type="url"
              value={formData.url ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="Enter URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Enter notes"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
