import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home';

const mockMovies = [
  {
    id: 1,
    title: 'Inception',
    overview: 'Dreams within dreams.',
    poster_path: '/poster.jpg',
    vote_average: 8.8,
    release_date: '2010-07-16',
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Home', () => {
  it('renders movies from fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: mockMovies }),
      })
    );

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:movieId?" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
  });

  it('shows no results when API returns empty results array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
    );

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:movieId?" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    });
  });

  it('handles API error (response not ok)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
    );

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:movieId?" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('HTTP error! status: 500')).toBeInTheDocument();
    });
  });

  it('handles invalid API response format', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ wrongKey: [] }),
      })
    );

    render(
      <MemoryRouter initialEntries={['/1']}>
        <Routes>
          <Route path="/:page/:movieId?" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/unexpected api response/i)).toBeInTheDocument();
    });
  });

  it('search updates the query and navigates to page 1', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: mockMovies }),
      })
    );

    render(
      <MemoryRouter initialEntries={['/2']}>
        <Routes>
          <Route path="/:page/:movieId?" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'Inception' } });

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    const saved = localStorage.getItem('movies-search-term');
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved as string)).toBe('Inception');
  });
});
