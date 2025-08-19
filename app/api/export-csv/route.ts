import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  const rows: Array<Record<string, string | number | boolean>> = await req.json();
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h] ?? '')).join(','))].join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="export.csv"'
    }
  });
}
