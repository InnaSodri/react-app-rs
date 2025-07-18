import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../../App';

describe('App component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Movies Search/i)).toBeInTheDocument();
  });

  it('shows error message when fetch returns HTTP error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/HTTP error!/i)).toBeInTheDocument();
    });
  });

  it('shows error message when no movies found for search term', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    render(<App />);

    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'nonexistentmovie');
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/No movies found for "nonexistentmovie"/i)
      ).toBeInTheDocument();
    });
  });

  it('shows generic error message when fetch throws non-Error object', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce('something went wrong');

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/An unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });

  it('handles empty result without search term (popular movies with 0 results)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/No movies found/)).not.toBeInTheDocument();
    });
  });
});
