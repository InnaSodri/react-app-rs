import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { Search } from './Search';
import { Results } from './Results';
import Details from './Details';
import { useSavedSearchQuery } from '../hooks/useSavedSearchQuery';
import './Home.css';

const BASE_URL = 'https://api.themoviedb.org/3';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const navigate = useNavigate();
  const { page = '1', movieId } = useParams();
  const savedQuery = useSavedSearchQuery();
  const [query, setQuery] = useState(savedQuery || '');
  const pageNumber = Number(page);

  useEffect(() => {
    isMounted.current = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query.trim()
          ? `${BASE_URL}/search/movie?api_key=${import.meta.env.VITE_API_KEY}&query=${encodeURIComponent(query)}&page=${pageNumber}`
          : `${BASE_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&page=${pageNumber}`;

        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.results)) {
          throw new Error('Unexpected API response format.');
        }

        if (isMounted.current) setMovies(data.results);
      } catch (err: unknown) {
        if (isMounted.current) {
          setMovies([]);
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred'
          );
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      isMounted.current = false;
    };
  }, [query, pageNumber]);

  const handleSearch = (term: string) => {
    setQuery(term);
    localStorage.setItem('movies-search-term', JSON.stringify(term));
    navigate(`/1`);
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/${newPage}${movieId ? `/${movieId}` : ''}`);
  };

  const openDetails = (id: number) => {
    navigate(`/${pageNumber}/${id}`);
  };

  const closeDetails = () => {
    navigate(`/${pageNumber}`);
  };

  return (
    <>
      <Search onSearch={handleSearch} initialValue={query} />
      <div className="master-detail-layout">
        <Results
          movies={movies}
          loading={loading}
          error={error}
          onCardClick={openDetails}
          currentPage={pageNumber}
          onPageChange={handlePageChange}
        />
        {movieId && (
          <Details
            key={movieId}
            movieId={Number(movieId)}
            onClose={closeDetails}
          />
        )}
      </div>
    </>
  );
};
