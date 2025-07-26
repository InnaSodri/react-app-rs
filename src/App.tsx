import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Routes, Route, useLocation } from 'react-router-dom';
import { Film } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Search } from './components/Search';
import { Results } from './components/Results';
import { About } from './components/About';
import Details from './components/Details';
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

  const isMounted = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const page = Number(searchParams.get('page')) || 1;
  const detailsId = searchParams.get('details');

  useEffect(() => {
    if (!isHomePage) return;

    isMounted.current = true;

    const fetchMovies = async (term: string, pageNum: number) => {
      setLoading(true);
      setError(null);
      try {
        const url = term.trim()
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}&page=${pageNum}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageNum}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.results) || data.results.length === 0) {
          if (term.trim()) {
            throw new Error(`No movies found for "${term}"`);
          } else {
            setMovies([]);
          }
          return;
        }
        if (isMounted.current) setMovies(data.results);
      } catch (err: unknown) {
        if (isMounted.current) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred');
          }
          setMovies([]);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchMovies(searchTerm, page);

    return () => {
      isMounted.current = false;
    };
  }, [searchTerm, page, isHomePage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      if (detailsId) params.set('details', detailsId);
      return params;
    });
  };

  const openDetails = (id: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('details', id.toString());
      return params;
    });
  };

  const closeDetails = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('details');
      return params;
    });
  };

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

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Search onSearch={handleSearch} initialValue={searchTerm} />
                <div className="master-detail-layout">
                  <Results
                    movies={movies}
                    loading={loading}
                    error={error}
                    onCardClick={openDetails}
                    currentPage={page}
                    onPageChange={handlePageChange}
                  />
                  {detailsId && (
                    <Details
                      movieId={Number(detailsId)}
                      onClose={closeDetails}
                    />
                  )}
                </div>
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<p>404 - Page Not Found</p>} />
        </Routes>
      </main>
    </ErrorBoundary>
  );
};

export default App;
