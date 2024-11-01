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
import { Label } from "@/components/ui/label";

interface SecretKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (secretKey: string) => void;
  action: "encrypt" | "decrypt";
}

export function SecretKeyModal({
  open,
  onOpenChange,
  onSubmit,
  action,
}: SecretKeyModalProps) {
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(secretKey);
    setSecretKey("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Secret Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">
              {action === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 