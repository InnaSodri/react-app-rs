import React, { useEffect, useRef, useState } from 'react';
import {
  useSearchParams,
  useLocation,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import { Movie } from '../types';
import { Search } from './Search';
import { Results } from './Results';
import { useSavedSearchQuery } from '../hooks/useSavedSearchQuery';
import './Home.css';

const BASE_URL = 'https://api.themoviedb.org/3';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const savedQuery = useSavedSearchQuery();
  const queryParam = searchParams.get('query');
  const query = queryParam || savedQuery;
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    if (!queryParam && savedQuery) {
      const params = new URLSearchParams(searchParams);
      params.set('query', savedQuery);
      params.set('page', '1');
      setSearchParams(params);
    }
  }, [queryParam, savedQuery, searchParams, setSearchParams]);

  useEffect(() => {
    if (!isHomePage) return;
    isMounted.current = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query.trim()
          ? `${BASE_URL}/search/movie?api_key=${import.meta.env.VITE_API_KEY}&query=${encodeURIComponent(
              query
            )}&page=${page}`
          : `${BASE_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&page=${page}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.results) || data.results.length === 0) {
          if (query.trim()) throw new Error(`No movies found for "${query}"`);
          else setMovies([]);
          return;
        }
        if (isMounted.current) setMovies(data.results);
      } catch (err: unknown) {
        if (isMounted.current) {
          if (err instanceof Error) setError(err.message);
          else setError('An unexpected error occurred');
          setMovies([]);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted.current = false;
    };
  }, [query, page, isHomePage]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams();
    params.set('query', term);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const openDetails = (id: number) => {
    navigate(`/details/${id}${location.search}`);
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
          currentPage={page}
          onPageChange={handlePageChange}
        />
        <Outlet />
      </div>
    </>
  );
};
