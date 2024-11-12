"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

export function CreateTwitterBangerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addData } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    imageUrl: "",
    category: "",
  });

  const handleImageUpload = useCallback((result: any) => {
    if (result?.event === "success") {
      setFormData(prev => ({
        ...prev,
        imageUrl: result.info.secure_url
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addData("twitterBangers", formData);
      toast({
        title: "Success",
        description: "Twitter banger created successfully",
      });
      onOpenChange(false);
      setFormData({ content: "", imageUrl: "", category: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create twitter banger",
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
          <DialogTitle>Create New Twitter Banger</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Tweet Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your tweet..."
              className="h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECH">Tech</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="PERSONAL">Personal</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              {formData.imageUrl ? (
                <div className="relative w-32 h-32">
                  <img
                    src={formData.imageUrl}
                    alt="Upload"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <CldUploadWidget onUpload={handleImageUpload} uploadPreset="xfddec76">
                {({ open }) => {
                  const onClick = () => {
                    open();
                  };
                  return (
                    <Button
                      type="button"
                      variant={"secondary"}
                      onClick={onClick}
                    >
                      <ImagePlus className="h-5 w-4 mr-3" />
                      Upload an image
                    </Button>
                  );
                }}
              </CldUploadWidget>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Banger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 