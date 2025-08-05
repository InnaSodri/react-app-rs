import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Movie } from '../types';
const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3/' }),
  tagTypes: ['Movies', 'Movie'],
  endpoints: (builder) => ({
    searchMovies: builder.query<
      SearchResponse,
      { query: string; page: number }
    >({
      query: ({ query, page }) =>
        `search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Movies', id: 'LIST' }];
        }

        return [
          { type: 'Movies', id: 'LIST' },
          ...result.results.map((movie) => ({
            type: 'Movie' as const,
            id: movie.id,
          })),
        ];
      },
    }),
    getMovieDetails: builder.query<Movie, string>({
      query: (id) => `movie/${id}?api_key=${API_KEY}`,
      providesTags: (_result, _error, id) => [{ type: 'Movie', id }],
    }),
  }),
});

export const {
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  util: { invalidateTags },
} = tmdbApi;
