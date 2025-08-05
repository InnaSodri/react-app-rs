import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from './Search';
import { Results } from './Results';
import { useSavedSearchQuery } from '../hooks/useSavedSearchQuery';
import LazyDetailsWrapper from './LazyDetailsWrapper';
import { useSearchMoviesQuery, invalidateTags } from '../services/tmdbApi';
import { store } from '../store';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { page = '1', movieId } = useParams();
  const savedQuery = useSavedSearchQuery();
  const [query, setQuery] = useState(savedQuery || '');
  const pageNumber = Number(page);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSearchMoviesQuery({ query, page: pageNumber }, { skip: !query });

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

  const handleInvalidate = () => {
    store.dispatch(invalidateTags([{ type: 'Movies', id: 'LIST' }]));
  };

  return (
    <>
      <Search onSearch={handleSearch} initialValue={query} />
      <div className="master-detail-layout">
        <div className={movieId ? 'results-half' : 'results-full'}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={refetch} disabled={isFetching}>
              Refresh
            </button>
            <button onClick={handleInvalidate}>Invalidate Cache</button>
          </div>
          <Results
            movies={data?.results || []}
            loading={isLoading}
            error={isError ? (error as Error).message : null}
            onCardClick={openDetails}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
          />
        </div>
        {movieId && (
          <div className="details-pane">
            <LazyDetailsWrapper
              key={movieId}
              movieId={Number(movieId)}
              onClose={closeDetails}
            />
          </div>
        )}
      </div>
    </>
  );
};
