export type MovieLike = {
    title?: string | null;
    name?: string | null;
    original_title?: string | null;
    original_name?: string | null;
    overview?: string | null;
  };
  
  export const pickTitle = (m: MovieLike): string =>
    m.title ?? m.name ?? m.original_title ?? m.original_name ?? '';
  
  export const pickOverview = (m: MovieLike): string =>
    m.overview ?? '';
  