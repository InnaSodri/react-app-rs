import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Movies Search/i)).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Search movies/i)).toBeInTheDocument();
  });

  it('navigates to About page', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText(/About This App/i)).toBeInTheDocument();
  });

  it('renders 404 for unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-page']}>
        <App />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/404 - Page Not Found/i)
    ).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })
      )
    );

    render(
      <MemoryRouter initialEntries={['/?search=broken']}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/HTTP error! status: 500/i)
    ).toBeInTheDocument();
  });

  it('displays message when no results found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        })
      )
    );

    render(
      <MemoryRouter initialEntries={['/?search=empty']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('No movies found.')).toBeInTheDocument();
    expect(
      await screen.findByText('Try searching for a different movie title.')
    ).toBeInTheDocument();
  });

  it('does not fetch movies when not on homepage', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('displays no movies if search term is empty and API returns empty array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        })
      )
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('No movies found.')).toBeInTheDocument();
    expect(
      await screen.findByText('Try searching for a different movie title.')
    ).toBeInTheDocument();
  });

  it('displays fallback error message when thrown value is not an Error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => {
        throw 'unexpected string error';
      })
    );

    render(
      <MemoryRouter initialEntries={['/?search=fail']}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/An unexpected error occurred/i)
    ).toBeInTheDocument();
  });

  it('sets movies to empty if no search term and no results returned', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        })
      )
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('No movies found.')).toBeInTheDocument();
  });

  it('cleans up isMounted on unmount', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                {
                  id: 1,
                  title: 'Test',
                  overview: '',
                  poster_path: null,
                  release_date: '',
                  vote_average: 0,
                },
              ],
            }),
        })
      )
    );

    const { unmount } = render(
      <MemoryRouter initialEntries={['/?search=test']}>
        <App />
      </MemoryRouter>
    );

    unmount();
  });

  it('shows loading spinner when fetching movies', async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve({ results: [] }),
              });
            }, 1000);
          })
      )
    );

    render(
      <MemoryRouter initialEntries={['/?search=loading']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    vi.runAllTimers();
  });
});
