"use client";
import {useEffect, useState} from "react";

const STORAGE_KEY = "movies-search-term";

export function useSavedSearchQuery(): string | null {
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setQuery(stored ? JSON.parse(stored) : null);
    } catch {
      setQuery(null);
    }
  }, []);

  return query;
}
