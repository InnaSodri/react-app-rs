import { useEffect, useState } from 'react';

const STORAGE_KEY = 'movies-search-term';

export function useSavedSearchQuery(defaultValue = ''): string {
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setQuery(JSON.parse(stored));
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${STORAGE_KEY}":`, err);
    }
  }, [defaultValue]);

  return query;
}
