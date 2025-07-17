import React, { Component } from 'react';
import Card from './Card';
import { Loading } from './Loading';
import { ErrorMessage } from './ErrorMessage';
import './Results.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface Props {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export class Results extends Component<Props> {
  render() {
    const { movies, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (movies.length === 0) {
      return (
        <div className="results-empty">
          <p>No movies found.</p>
          <p>Try searching for a different movie title.</p>
        </div>
      );
    }

    return (
      <div className="results-container">
        <h2 className="results-title">Search Results ({movies.length})</h2>
        <div className="results-scroller">
          {movies.map((movie) => (
            <div key={movie.id} className="results-item">
              <Card movie={movie} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
