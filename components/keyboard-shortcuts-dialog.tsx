"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
  { key: "Ctrl+N", description: "Create new item" },
  { key: "Ctrl+/", description: "Show keyboard shortcuts" },
];

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex justify-between items-center"
            >
              <span className="font-medium">{shortcut.key}</span>
              <span className="text-muted-foreground">
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}