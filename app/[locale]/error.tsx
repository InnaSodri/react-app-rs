'use client';

export default function LocaleError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Error in locale route</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
