import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Home } from '../Home';
import { ThemeProvider } from '../../contexts';
import { Provider } from 'react-redux';
import { store } from '../../store';
import type { Mock } from 'vitest';
import type { Middleware, Reducer } from '@reduxjs/toolkit';

vi.mock('../../services/tmdbApi', () => {
  const reducer: Reducer = (state) => state ?? {};
  const middleware: Middleware = () => (next) => (action) => next(action);
  return {
    useSearchMoviesQuery: vi.fn(),
    useGetMovieDetailsQuery: vi.fn(() => ({
      data: {
        id: 1,
        title: 'Inception',
        overview: 'No description available.',
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })),
    invalidateTags: vi.fn(() => ({ type: 'invalidate' })),
    tmdbApi: { reducerPath: 'tmdbApi', reducer, middleware },
  };
});

import { useSearchMoviesQuery } from '../../services/tmdbApi';

type Movie = { id: number; title: string };

type SearchReturn = {
  data?: { results: Movie[] } | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const refetchMock: Mock<() => Promise<void>> = vi.fn(() => Promise.resolve());

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname}</div>;
}

function renderAt(path = '/1') {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/:page?/:movieId?" element={<Home />} />
          </Routes>
          <LocationProbe />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}

const mockedUseSearch = vi.mocked(useSearchMoviesQuery);

function setQueryReturn(partial: Partial<SearchReturn>) {
  const base: SearchReturn = {
    data: { results: [] },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: refetchMock,
  };
  const value = { ...base, ...partial } as unknown as ReturnType<
    typeof useSearchMoviesQuery
  >;
  mockedUseSearch.mockReturnValue(value);
}

beforeEach(() => {
  refetchMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Home', () => {
  it('renders search input and buttons', () => {
    setQueryReturn({});
    renderAt();
    expect(screen.getByPlaceholderText(/search movies/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /invalidate cache/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows data after search', async () => {
    setQueryReturn({ data: { results: [{ id: 1, title: 'Inception' }] } });
    renderAt('/1');
    const input = screen.getByPlaceholderText(/search movies/i);
    fireEvent.change(input, { target: { value: 'Inception' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(await screen.findByText('Inception')).toBeInTheDocument();
  });

  it('displays error state when error is true', async () => {
    setQueryReturn({
      isError: true,
      error: new Error('Fetch failed'),
      data: { results: [] },
    });
    renderAt('/1');
    const input = screen.getByPlaceholderText(/search movies/i);
    fireEvent.change(input, { target: { value: 'anything' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/fetch failed/i)).toBeInTheDocument();
  });

  it('navigates to next page when Next is clicked', async () => {
    setQueryReturn({ data: { results: [{ id: 1, title: 'Inception' }] } });
    renderAt('/1');
    expect(await screen.findByText('Inception')).toBeInTheDocument();
    const next = screen.getByRole('button', { name: /next/i });
    fireEvent.click(next);
    await waitFor(() => {
      expect(screen.getByTestId('loc')).toHaveTextContent('/2');
    });
  });

  it('opens details for a movie and updates URL', async () => {
    setQueryReturn({ data: { results: [{ id: 1, title: 'Inception' }] } });
    renderAt('/1');
    const card = await screen.findByText('Inception');
    fireEvent.click(card);
    await waitFor(() => {
      expect(screen.getByTestId('loc')).toHaveTextContent('/1/1');
    });
  });

  it('renders details pane when movieId is present and closes on main area click', async () => {
    setQueryReturn({ data: { results: [{ id: 1, title: 'Inception' }] } });
    renderAt('/1/1');
    expect(document.querySelector('.details-pane')).toBeInTheDocument();
    const mainArea =
      document.querySelector('.results-half') ||
      document.querySelector('.results-full') ||
      document.body;
    if (mainArea) {
      fireEvent.click(mainArea);
    }
    await waitFor(() => {
      expect(screen.getByTestId('loc')).toHaveTextContent('/1');
    });
  });

  it('calls refetch on Refresh', async () => {
    setQueryReturn({ data: { results: [] } });
    renderAt('/1');
    const btn = screen.getByRole('button', { name: /refresh/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(refetchMock).toHaveBeenCalled();
  });

  it('invalidates cache and calls refetch', async () => {
    setQueryReturn({ data: { results: [] } });
    renderAt('/1');
    const btn = screen.getByRole('button', { name: /invalidate cache/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(refetchMock).toHaveBeenCalled();
  });

  it('uses results-full when no movieId', async () => {
    setQueryReturn({ data: { results: [] } });
    renderAt('/1');
    expect(document.querySelector('.results-full')).toBeInTheDocument();
    expect(document.querySelector('.results-half')).toBeNull();
  });

  it('uses results-half when movieId exists', async () => {
    setQueryReturn({ data: { results: [] } });
    renderAt('/1/123');
    expect(document.querySelector('.results-half')).toBeInTheDocument();
  });
});
