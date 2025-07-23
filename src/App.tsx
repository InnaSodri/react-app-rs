import React, { useEffect, useState, useRef } from 'react';
import { Film } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Search } from './components/Search';
import { Results } from './components/Results';
import './App.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    const fetchInitialMovies = async () => {
      await fetchMovies('');
    };

    fetchInitialMovies();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const buildUrl = (term: string): string => {
    return term.trim()
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}&page=1`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
  };

  const fetchMovies = async (term: string) => {
    setSearchTerm(term);
    setLoading(true);
    setError(null);

    try {
      const url = buildUrl(term);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results.length === 0 && term.trim()) {
        throw new Error(`No movies found for "${term}"`);
      }

      if (isMounted.current) {
        setMovies(data.results);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
        setMovies([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleTestError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error(
      'Test error thrown by user - Error Boundary should catch this!'
    );
  }

  return (
    <ErrorBoundary>
      <main className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <Film className="film-icon" />
            Movies Search
          </h1>
          <p className="app-subtitle">
            Search for your favorite movies or browse popular titles — built
            with React Functional Components and TheMovieDB API
          </p>
        </header>

        <Search onSearch={fetchMovies} initialValue={searchTerm} />
        <Results movies={movies} loading={loading} error={error} />

        <button className="test-error-btn" onClick={handleTestError}>
          Test Error
        </button>
      </main>
    </ErrorBoundary>
  );
};

export default App;
