import { render, screen } from '@testing-library/react';
import { Card } from '../Card';
import { describe, it, expect } from 'vitest';

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
    const img = screen.getByAltText('Poster of Inception') as HTMLImageElement;
    expect(img.src).toContain('/poster.jpg');
  });

  it('uses fallback poster when poster_path is null', () => {
    render(<Card movie={{ ...baseMovie, poster_path: null }} />);
    const img = screen.getByAltText('Poster of Inception') as HTMLImageElement;
    expect(img.src).toContain('unsplash.com');
  });

  it('shows "No description available." if overview is empty', () => {
    render(<Card movie={{ ...baseMovie, overview: '' }} />);
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('shows "TBA" if release_date is null', () => {
    render(<Card movie={{ ...baseMovie, release_date: null }} />);
    expect(screen.getByText('TBA')).toBeInTheDocument();
  });
});
