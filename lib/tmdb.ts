import { tmdbLocale } from '@/lib/i18n';

const BASE = 'https://api.themoviedb.org/3';
const V4 = process.env.TMDB_V4_TOKEN;
const V3 = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

function withAuth(url: string) {
  if (V4 && V4.trim().length > 20) {
    return {
      url,
      init: {
        headers: {
          Authorization: `Bearer ${V4}`,
          Accept: 'application/json'
        }
      } as RequestInit
    };
  }
  if (V3 && V3.trim().length > 20) {
    const suffix = url.includes('?') ? '&' : '?';
    return {
      url: `${url}${suffix}api_key=${V3}`,
      init: {
        headers: { Accept: 'application/json' }
      } as RequestInit
    };
  }
  throw new Error('TMDB credentials are not configured');
}

async function assertOk(res: Response) {
  if (res.ok) return;
  const text = await res.text().catch(() => '');
  throw new Error(`TMDB ${res.status} ${res.statusText} ${text.slice(0, 200)}`);
}

export async function fetchPopular(locale: string, page = 1) {
  const lang = tmdbLocale(locale);
  const { url, init } = withAuth(
    `${BASE}/movie/popular?language=${encodeURIComponent(lang)}&page=${page}`
  );
  const res = await fetch(url, { ...init, cache: 'force-cache', next: { revalidate: 3600 } });
  await assertOk(res);
  return res.json();
}
