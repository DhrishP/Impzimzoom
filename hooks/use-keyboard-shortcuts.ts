"use client";

import { useEffect } from "react";

export const useHotkeys = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Using Alt+N instead of Ctrl+N to avoid browser conflicts
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
};