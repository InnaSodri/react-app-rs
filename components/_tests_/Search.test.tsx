import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('calls onSearch when mounted with initial term', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} initialValue="Terminator" />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Terminator')).toBeInTheDocument();
    });
  });

  it('calls onSearch and saves to localStorage on button click', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(input);
    await userEvent.type(input, 'Inception');
    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('Inception');

    await waitFor(() => {
      const item = localStorage.getItem(STORAGE_KEY);
      expect(item).not.toBeNull();
      expect(JSON.parse(item as string)).toBe('Inception');
    });
  });

  it('calls onSearch on Enter key press and saves to localStorage', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search movies...');

    await userEvent.clear(input);
    await userEvent.type(input, 'Batman{enter}');

    expect(onSearch).toHaveBeenCalledWith('Batman');

    await waitFor(() => {
      const item = localStorage.getItem(STORAGE_KEY);
      expect(item).not.toBeNull();
      expect(JSON.parse(item as string)).toBe('Batman');
    });
  });

  it('does not call onSearch when input is empty and button is clicked', async () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(input);
    await userEvent.type(input, '   ');
    await userEvent.click(button);

    expect(onSearch).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
