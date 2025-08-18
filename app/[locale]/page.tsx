import ClientHome from '@/components/ClientHome';
import { fetchPopular } from '@/lib/tmdb';
import { getLocale } from 'next-intl/server';

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNum = Number(page ?? '1');
  const locale = await getLocale();
  const popular = await fetchPopular(locale, pageNum);
  return <ClientHome initialMovies={popular?.results ?? []} initialPage={pageNum} />;
}
