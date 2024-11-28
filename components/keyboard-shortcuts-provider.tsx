"use client";

import { useState, useEffect } from "react";
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog";

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        setShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {children}
      <KeyboardShortcutsDialog
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </>
  );
} 