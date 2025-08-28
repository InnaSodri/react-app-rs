export const baseName = (name: string): string => name.replace(/\s\d+$/, '');
export const variantNo = (name: string): number | null => {
  const m = name.match(/\s(\d+)$/);
  return m ? Number(m[1]) : null;
};
