import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { configureStore, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import {
  tmdbApi,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  invalidateTags,
} from '../@/services/tmdbApi';

function extractUrl(arg: Parameters<typeof fetch>[0]): string {
  if (typeof arg === 'string') return arg;
  if (arg instanceof URL) return arg.toString();
  return (arg as Request).url ?? String(arg);
}

describe('tmdbApi', () => {
  const originalFetch = global.fetch;
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

  const makeStore = () =>
    configureStore({
      reducer: { [tmdbApi.reducerPath]: tmdbApi.reducer },
      middleware: (gDM) => gDM().concat(tmdbApi.middleware),
    });

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ results: [] }))
    );
    global.fetch = fetchMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('exports hooks and invalidateTags', () => {
    expect(typeof useSearchMoviesQuery).toBe('function');
    expect(typeof useGetMovieDetailsQuery).toBe('function');
    const action = invalidateTags(['Movies']);
    expect(typeof action.type).toBe('string');
  });

  it('dispatching searchMovies builds URL with default page=1', async () => {
    const store = makeStore();
    type State = ReturnType<typeof store.getState>;
    type Dispatch = ThunkDispatch<State, unknown, UnknownAction>;
    const dispatch: Dispatch = store.dispatch as Dispatch;

    await dispatch(
      tmdbApi.endpoints.searchMovies.initiate({ query: 'inception', page: 1 })
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const url = extractUrl(fetchMock.mock.calls[0][0]);
    expect(url.toLowerCase()).toContain('inception');
    expect(url).toMatch(/(^|[?&])page=1(&|$)/);
  });

  it('dispatching searchMovies builds URL with provided page', async () => {
    const store = makeStore();
    type State = ReturnType<typeof store.getState>;
    type Dispatch = ThunkDispatch<State, unknown, UnknownAction>;
    const dispatch: Dispatch = store.dispatch as Dispatch;

    await dispatch(
      tmdbApi.endpoints.searchMovies.initiate({ query: 'matrix', page: 3 })
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const url = extractUrl(fetchMock.mock.calls[0][0]);
    expect(url.toLowerCase()).toContain('matrix');
    expect(url).toMatch(/(^|[?&])page=3(&|$)/);
  });

  it('dispatching getMovieDetails builds URL with id', async () => {
    const store = makeStore();
    type State = ReturnType<typeof store.getState>;
    type Dispatch = ThunkDispatch<State, unknown, UnknownAction>;
    const dispatch: Dispatch = store.dispatch as Dispatch;

    await dispatch(tmdbApi.endpoints.getMovieDetails.initiate('42'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const url = extractUrl(fetchMock.mock.calls[0][0]);
    expect(url).toMatch(/42/);
  });

  it('refetches on invalidating provided Movie tag', async () => {
    const store = makeStore();
    type State = ReturnType<typeof store.getState>;
    type Dispatch = ThunkDispatch<State, unknown, UnknownAction>;
    const dispatch: Dispatch = store.dispatch as Dispatch;

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 99,
              title: 't',
              overview: '',
              poster_path: '',
              release_date: '',
              vote_average: 0,
            },
          ],
        })
      )
    );

    await dispatch(
      tmdbApi.endpoints.searchMovies.initiate({ query: 'q', page: 1 })
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await dispatch(tmdbApi.util.invalidateTags([{ type: 'Movie', id: 99 }]));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('refetches on invalidating Movies LIST when result was undefined', async () => {
    const store = makeStore();
    type State = ReturnType<typeof store.getState>;
    type Dispatch = ThunkDispatch<State, unknown, UnknownAction>;
    const dispatch: Dispatch = store.dispatch as Dispatch;

    fetchMock.mockResolvedValueOnce(new Response('x', { status: 500 }));

    await dispatch(
      tmdbApi.endpoints.searchMovies.initiate({ query: 'q', page: 1 })
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await dispatch(
      tmdbApi.util.invalidateTags([{ type: 'Movies', id: 'LIST' }])
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
