import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value if nothing in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should set and update value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('updated'));
  });

  it('should use value from localStorage if present', () => {
    localStorage.setItem(KEY, JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    expect(result.current[0]).toBe('stored-value');
  });
  it('should return initial value if localStorage has invalid JSON', () => {
    localStorage.setItem(KEY, 'not-valid-json');
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('default');
  });
  it('should handle error when setting localStorage fails', () => {
    const originalStringify = JSON.stringify;
    JSON.stringify = () => {
      throw new Error('Mock stringify error');
    };

    const { result } = renderHook(() => useLocalStorage(KEY, 'test'));
    expect(() => result.current[1]('new value')).not.toThrow();

    JSON.stringify = originalStringify;
  });
});
