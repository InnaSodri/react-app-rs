import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Movie } from '../types';
import { Search } from './Search';
import { Results } from './Results';
import Details from './Details';
import './Home.css';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

export const Home: React.FC = () => {
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

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = searchTerm.trim()
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.results) || data.results.length === 0) {
          if (searchTerm.trim())
            throw new Error(`No movies found for "${searchTerm}"`);
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
  }, [searchTerm, page, isHomePage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', '1');
      params.delete('details');
      return params;
    });
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
          <Details movieId={Number(detailsId)} onClose={closeDetails} />
        )}
      </div>
    </>
  );
};
