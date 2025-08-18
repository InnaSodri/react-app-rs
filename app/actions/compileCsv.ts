'use server';

export type CsvItem = {id:number; title:string; year?:number};

export async function compileCsvOnServer(items: CsvItem[]) {
  const header = ['id','title','year'];
  const rows = items.map(i => [i.id, `"${(i.title||'').replace(/"/g,'""')}"`, i.year ?? '']);
  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csv;
}
