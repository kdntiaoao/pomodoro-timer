"use client";

import { useEffect } from "react";

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = title;
  }, [title]);
}
