import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from './Search';
import { Results } from './Results';
import { useSavedSearchQuery } from '../hooks/useSavedSearchQuery';
import LazyDetailsWrapper from './LazyDetailsWrapper';
import { useSearchMoviesQuery, invalidateTags } from '../services/tmdbApi';
import { store } from '../store';
import './styles/Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { page = '1', movieId } = useParams();
  const savedQuery = useSavedSearchQuery();
  const [query, setQuery] = useState(savedQuery || '');
  const pageNumber = Number(page);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [justInvalidated, setJustInvalidated] = useState(false);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSearchMoviesQuery(
      { query: query || 'popular', page: pageNumber },
      {
        skip: false,
      }
    );

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

  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
    setTimeout(() => setLastUpdated(null), 3000);
  };

  const handleInvalidate = async () => {
    store.dispatch(invalidateTags([{ type: 'Movies', id: 'LIST' }]));
    await refetch();
    setJustInvalidated(true);
    setTimeout(() => setJustInvalidated(false), 2000);
    setLastUpdated(new Date());
    setTimeout(() => setLastUpdated(null), 3000);
  };

  return (
    <>
      <Search onSearch={handleSearch} initialValue={query} />
      <div className="master-detail-layout">
        <div className={movieId ? 'results-half' : 'results-full'}>
          <div className="refresh-controls">
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              🔄 Refresh
            </button>
            <button className="refresh-btn" onClick={handleInvalidate}>
              ♻️ {justInvalidated ? 'Invalidated!' : 'Invalidate Cache'}
            </button>
          </div>
          {lastUpdated && (
            <div className={`last-updated${justInvalidated ? ' hidden' : ''}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}

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

export default Home;
