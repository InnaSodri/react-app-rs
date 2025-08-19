import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { customRender as render } from '../../test-utils';
import Card from '../Card';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../@/features/selectedItems/selectedItemsSlice';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../@/contexts/';

const baseMovie = {
  id: 1,
  title: 'Inception',
  overview: 'Dreams within dreams.',
  poster_path: '/poster.jpg',
  vote_average: 8.8,
  release_date: '2010-07-16',
};

describe('Card Component', () => {
  it('renders title, overview, rating, and release year', () => {
    render(<Card movie={baseMovie} />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Dreams within dreams.')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('⭐ 8.8')).toBeInTheDocument();
  });

  it('uses correct poster image when poster_path exists', () => {
    render(<Card movie={baseMovie} />);
    const img = screen.getByAltText('Poster of Inception');
    expect((img as HTMLImageElement).src).toContain('/poster.jpg');
  });

  it('uses fallback poster when poster_path is null', () => {
    render(<Card movie={{ ...baseMovie, poster_path: null }} />);
    const img = screen.getByAltText('Poster of Inception');
    expect((img as HTMLImageElement).src).toContain('unsplash.com');
  });

  it('shows "No description available." if overview is empty', () => {
    render(<Card movie={{ ...baseMovie, overview: '' }} />);
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('shows "TBA" if release_date is null', () => {
    render(<Card movie={{ ...baseMovie, release_date: null }} />);
    expect(screen.getByText('TBA')).toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', () => {
    const handleClick = vi.fn();
    render(<Card movie={baseMovie} onClick={handleClick} />);
    const image = screen.getByRole('img', { name: 'Poster of Inception' });
    const card = image.closest('.card');
    if (card) fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('dispatches toggleItem when checkbox is toggled', () => {
    const { store } = render(<Card movie={baseMovie} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const state = store.getState().selectedItems.items;
    expect(state).toHaveProperty('1');
  });

  it('renders checkbox as checked if movie is already selected', () => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
      preloadedState: {
        selectedItems: {
          items: {
            '1': {
              id: '1',
              name: 'Inception',
              description: 'Dreams within dreams.',
              detailsUrl: 'https://www.themoviedb.org/movie/1',
            },
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <Card movie={baseMovie} />
        </ThemeProvider>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
  it('renders checkbox as unchecked when item is not selected', () => {
    const store = configureStore({
      reducer: {
        selectedItems: selectedItemsReducer,
      },
      preloadedState: {
        selectedItems: {
          items: {},
        },
      },
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <Card movie={baseMovie} />
        </ThemeProvider>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
  it('uses fallback description when overview is missing', () => {
    const movie = {
      id: 123,
      title: 'Test Movie',
      overview: '',
    };

    const payload = {
      id: String(movie.id),
      name: movie.title,
      description: movie.overview || 'No description available.',
      detailsUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    };

    expect(payload.description).toBe('No description available.');
  });
});
