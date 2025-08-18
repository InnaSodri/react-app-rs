'use client';

import {useState, useEffect} from 'react';
import {useRouter, usePathname, Link} from '@/navigation';
import {useSearchParams} from 'next/navigation';
import type {AppPathname} from '@/i18n/routing';
import type {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import type {SerializedError} from '@reduxjs/toolkit';
import {useSavedSearchQuery} from '@/hooks/useSavedSearchQuery';
import {useSearchMoviesQuery, invalidateTags} from '@/services/tmdbApi';
import {store} from '@/store';
import {useAppDispatch} from '@/hooks';
import {selectItem} from '@/features/selectedItems/selectedItemsSlice';
import {Search} from '@/components/Search';
import {Results} from '@/components/Results';
import Flyout from '@/components/Flyout';
import type {Movie} from '@/types';
import LazyDetailsWrapper from '@/components/LazyDetailsWrapper';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import '@/components/styles/Home.css';
import {useTranslations, useLocale} from 'next-intl';

type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview?: string;
  vote_average?: number | string;
  release_date?: string;
};

const isFetchBaseQueryError = (e: unknown): e is FetchBaseQueryError =>
  typeof e === 'object' && e !== null && 'status' in (e as Record<string, unknown>);

const hasSerializedMessage = (e: unknown): e is SerializedError =>
  typeof e === 'object' && e !== null && typeof (e as Record<string, unknown>).message === 'string';

const extractMsgFromData = (data: unknown): string | null => {
  if (typeof data === 'string') return data;
  if (typeof data === 'object' && data !== null) {
    const obj = data as {status_message?: unknown; message?: unknown};
    if (typeof obj.status_message === 'string') return obj.status_message;
    if (typeof obj.message === 'string') return obj.message;
  }
  return null;
};

const getRtqErrorMessage = (err: unknown): string | null => {
  if (!err) return null;
  if (typeof err === 'string') return err;
  if (isFetchBaseQueryError(err)) {
    const msg = extractMsgFromData(err.data);
    const status =
      typeof err.status === 'number' || typeof err.status === 'string' ? String(err.status) : 'unknown';
    return msg ?? `HTTP ${status}`;
  }
  if (hasSerializedMessage(err)) return err.message ?? 'Unexpected error';
  if (err instanceof Error) return err.message;
  return 'Unexpected error';
};

function toMovie(m: unknown): Movie {
  const r = m as TMDBMovie | Record<string, unknown>;
  const id = Number((r as Record<string, unknown>).id ?? 0);
  const title =
    typeof (r as TMDBMovie).title === 'string'
      ? (r as TMDBMovie).title!
      : typeof (r as TMDBMovie).name === 'string'
      ? (r as TMDBMovie).name!
      : '';
  const poster_path =
    typeof (r as TMDBMovie).poster_path === 'string' ? (r as TMDBMovie).poster_path : null;
  const overview = typeof (r as TMDBMovie).overview === 'string' ? (r as TMDBMovie).overview! : '';
  const vote_raw = (r as TMDBMovie).vote_average;
  const vote_average = typeof vote_raw === 'number' ? vote_raw : Number(vote_raw ?? 0);
  const release_date =
    typeof (r as TMDBMovie).release_date === 'string' ? (r as TMDBMovie).release_date! : '';
  return {id, title, poster_path, overview, vote_average, release_date};
}

export default function ClientHome({
  initialMovies,
  initialPage
}: {
  initialMovies: unknown[];
  initialPage: number;
}) {
  const locale = useLocale();
  const tHome = useTranslations('home');
  const safe = (key: 'refresh' | 'invalidate' | 'invalidated' | 'lastUpdated', fallback: string) => {
    try {
      return tHome(key);
    } catch {
      return fallback;
    }
  };

  const router = useRouter();
  const pathname = usePathname() as AppPathname;
  const sp = useSearchParams();
  const dispatch = useAppDispatch();

  const savedQuery = useSavedSearchQuery();
  const [query, setQuery] = useState(savedQuery || '');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [justInvalidated, setJustInvalidated] = useState(false);

  const pageNumber = Number(sp.get('page') || String(initialPage || 1));
  const movieId = sp.get('movieId');

  const {data, isLoading, isFetching, isError, error, refetch} = useSearchMoviesQuery(
    {query: query || 'popular', page: pageNumber, locale},
    {skip: false}
  );

  useEffect(() => {
    if (query) localStorage.setItem('movies-search-term', JSON.stringify(query));
  }, [query]);

  const pushWithParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(sp.toString());
    mutate(params);
    const queryObj = Object.fromEntries(params) as Record<string, string>;
    router.push({pathname, query: queryObj});
  };

  const handleSearch = (term: string) => {
    setQuery(term);
    pushWithParams((p) => {
      p.set('page', '1');
      p.delete('movieId');
    });
  };

  const openDetails = (id: number) => {
    pushWithParams((p) => {
      p.set('movieId', String(id));
    });
  };

  const changePage = (newPage: number) => {
    if (newPage < 1) return;
    pushWithParams((p) => {
      p.set('page', String(newPage));
      p.delete('movieId');
    });
  };

  const closeDetails = () => pushWithParams((p) => p.delete('movieId'));

  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
    setTimeout(() => setLastUpdated(null), 3000);
  };

  const handleInvalidate = async () => {
    store.dispatch(invalidateTags([{type: 'Movies', id: 'LIST'}]));
    await refetch();
    setJustInvalidated(true);
    setTimeout(() => setJustInvalidated(false), 2000);
    setLastUpdated(new Date());
    setTimeout(() => setLastUpdated(null), 3000);
  };

  const handleSelectMovie = (m: Movie) => {
    dispatch(
      selectItem({
        id: String(m.id),
        name: m.title,
        description: m.overview ?? '',
        detailsUrl: `${pathname}?movieId=${m.id}`
      })
    );
  };

  const source: unknown[] = isFetching ? [] : ((data?.results as unknown[]) ?? initialMovies);
  const movies: Movie[] = source.map(toMovie);

  return (
    <>
      <div className="home-topbar">
  <div className="topbar-left">
    <Link href="/about" className="pill-link">About</Link>
  </div>
  <div className="topbar-right">
    <div className="locale-select"><LocaleSwitcher /></div>
    <ThemeToggle />
  </div>
</div>

      <Search onSearch={handleSearch} initialValue={query} />

      <div className="master-detail-layout">
        <div className={movieId ? 'results-half' : 'results-full'}>
          <div className="refresh-controls">
            <button className="refresh-btn" onClick={handleRefresh} disabled={isFetching}>
              {safe('refresh', 'Refresh')}
            </button>
            <button className="refresh-btn" onClick={handleInvalidate}>
              ♻️ {justInvalidated ? safe('invalidated', 'Invalidated!') : safe('invalidate', 'Invalidate Cache')}
            </button>
          </div>

          {lastUpdated && (
            <div className={`last-updated${justInvalidated ? 'hidden' : ''}`}>
              {safe('lastUpdated', 'Last updated:')} {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          <Results
            movies={movies}
            loading={isLoading || isFetching}
            error={isError ? getRtqErrorMessage(error) : null}
            onCardClick={openDetails}
            currentPage={pageNumber}
            onPageChange={changePage}
            onSelect={handleSelectMovie}
          />
        </div>

        {movieId && (
          <div className="details-pane">
            <LazyDetailsWrapper key={movieId} movieId={Number(movieId)} onClose={closeDetails} />
          </div>
        )}
      </div>

      <Flyout />
    </>
  );
}
