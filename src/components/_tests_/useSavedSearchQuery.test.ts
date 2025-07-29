import { renderHook } from '@testing-library/react';
import { useSavedSearchQuery } from '../../hooks/useSavedSearchQuery';
import { vi } from 'vitest';

const STORAGE_KEY = 'movies-search-term';

describe('useSavedSearchQuery', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns stored value if valid JSON exists', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('batman'));
    const { result } = renderHook(() => useSavedSearchQuery(''));
    expect(result.current).toBe('batman');
  });

  it('returns default value if nothing is in localStorage', () => {
    const { result } = renderHook(() => useSavedSearchQuery('default'));
    expect(result.current).toBe('default');
  });

  it('returns default value if JSON.parse throws an error', () => {
    localStorage.setItem(STORAGE_KEY, 'INVALID_JSON');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useSavedSearchQuery('fallback'));
    expect(result.current).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
