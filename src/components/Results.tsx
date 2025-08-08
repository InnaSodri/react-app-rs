import React from 'react';
import Card from './Card';
import { Loading } from './Loading';
import ErrorMessage from './ErrorMessage';
import { Movie } from '../types';
import './styles/Results.css';

interface Props {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onCardClick?: (id: number) => void;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
}

export const Results: React.FC<Props> = ({
  movies,
  loading,
  error,
  onCardClick,
  currentPage = 1,
  onPageChange,
}) => {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!movies.length) {
    return (
      <div className="results-empty">
        <p>No movies found.</p>
        <p>Try searching for a different movie title.</p>
      </div>
    );
  }

  return (
    <>
      <div className="results-container">
        <h2 className="results-title">Search Results ({movies.length})</h2>
        <div className="results-scroller" data-testid="results-list">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              movie={movie}
              onClick={() => onCardClick?.(movie.id)}
            />
          ))}
        </div>
      </div>

      <div className="pagination-controls" style={{ marginTop: '1rem' }}>
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className="pagination-btn"
          aria-label="Previous Page"
        >
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {currentPage}</span>
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          className="pagination-btn"
          aria-label="Next Page"
          data-testid="next-page"
        >
          Next
        </button>
      </div>
    </>
  );
};
