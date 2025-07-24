import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Search } from '../Search';

const STORAGE_KEY = 'movies-search-term';

describe('Search', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders input with initialValue prop', () => {
    render(<Search onSearch={() => {}} initialValue="Matrix" />);
    expect(screen.getByPlaceholderText('Search movies...')).toHaveValue(
      'Matrix'
    );
  });

  it('renders input with localStorage value', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('Avatar'));
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search movies...')).toHaveValue(
      'Avatar'
    );
  });

  it('calls onSearch when mounted with initial term', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} initialValue="Terminator" />);
    expect(onSearch).toHaveBeenCalledWith('Terminator');
  });

  it('calls onSearch and saves to localStorage on button click', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Inception' } });
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('Inception');

    const item = localStorage.getItem(STORAGE_KEY);
    expect(item).not.toBeNull();
    expect(JSON.parse(item as string)).toBe('Inception');
  });

  it('calls onSearch on Enter key press', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search movies...');

    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('Batman');

    const item = localStorage.getItem(STORAGE_KEY);
    expect(item).not.toBeNull();
    expect(JSON.parse(item as string)).toBe('Batman');
  });
});
