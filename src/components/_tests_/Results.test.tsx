import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Results } from '../Results';

vi.mock('../Card', () => ({
  __esModule: true,
  default: ({ movie }: { movie: { title: string } }) => (
    <div data-testid="card">{movie.title}</div>
  ),
}));

vi.mock('../Loading', () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock('../ErrorMessage', () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error">Error: {message}</div>
  ),
}));

const movies = [
  {
    id: 1,
    title: 'The Matrix',
    overview: 'A hacker discovers reality.',
    poster_path: '/matrix.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
  },
];

describe('Results', () => {
  it('shows loading', () => {
    render(<Results movies={[]} loading={true} error={null} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('shows error', () => {
    render(<Results movies={[]} loading={false} error="Error text" />);
    expect(screen.getByTestId('error')).toHaveTextContent('Error text');
  });

  it('shows empty message', () => {
    render(<Results movies={[]} loading={false} error={null} />);
    expect(screen.getByText('No movies found.')).toBeInTheDocument();
  });

  it('shows movie cards', () => {
    render(<Results movies={movies} loading={false} error={null} />);
    expect(screen.getByText('Search Results (1)')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(1);
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
  });
});
