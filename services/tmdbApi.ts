import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tmdbLocale } from '@/lib/i18n';

const BASE_URL = 'https://api.themoviedb.org/3';
const V3 = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? '';

export type TMDBMovie = {
  id: number;
  title?: string | null;
  name?: string | null;
  overview?: string | null;
  poster_path: string | null;
  vote_average?: number | null;
  release_date?: string | null;
};

export type TMDBVideo = {
  key?: string;
  site?: string;
  type?: string;
  official?: boolean;
  name?: string;
};

export type TMDBVideos = {
  results?: TMDBVideo[];
};

export type TMDBImage = {
  file_path?: string;
  width?: number;
  height?: number;
  iso_639_1?: string | null;
  vote_average?: number;
  vote_count?: number;
};

export type TMDBImages = {
  backdrops?: TMDBImage[];
  posters?: TMDBImage[];
};

export type TMDBSearchResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export type TMDBDetailsResponse = TMDBMovie & {
  videos?: TMDBVideos;
  images?: TMDBImages;
};

export type SearchMoviesArgs = { query: string; page?: number; locale?: string };
export type MovieDetailsArgs = { id: number | string; locale?: string };

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    searchMovies: builder.query<TMDBSearchResponse, SearchMoviesArgs>({
      query: ({ query, page = 1, locale }) => {
        const params: Record<string, string | number> = {
          query,
          page,
          language: tmdbLocale(locale ?? 'en'),
        };
        if (V3.trim().length > 10) {
          (params as Record<string, string>).api_key = V3;
        }
        return { url: '/search/movie', params };
      },
      providesTags: [{ type: 'Movies', id: 'LIST' }],
    }),
    movieDetails: builder.query<TMDBDetailsResponse, MovieDetailsArgs>({
      query: ({ id, locale }) => {
        const params: Record<string, string | number> = {
          language: tmdbLocale(locale ?? 'en'),
          append_to_response: 'videos,images',
        };
        if (V3.trim().length > 10) {
          (params as Record<string, string>).api_key = V3;
        }
        return { url: `/movie/${id}`, params };
      },
    }),
  }),
});

export const {
  useSearchMoviesQuery,
  useMovieDetailsQuery,
  useMovieDetailsQuery: useGetMovieDetailsQuery,
} = tmdbApi;

export const invalidateTags = tmdbApi.util.invalidateTags;
