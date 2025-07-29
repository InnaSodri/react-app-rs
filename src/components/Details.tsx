import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types';
import { Loading } from './Loading';
import ErrorMessage from './ErrorMessage';
import './Details.css';

interface DetailsProps {
  movieId: number;
  onClose: () => void;
}

const BASE_URL = 'https://api.themoviedb.org/3/movie';

const Details: React.FC<DetailsProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMovie(null);
    setError(null);
    setLoading(true);

    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/${movieId}?api_key=${import.meta.env.VITE_API_KEY}`
        );
        if (!res.ok) throw new Error('Failed to fetch movie details.');
        const data = await res.json();
        setMovie(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <>
      <div className="details-overlay"></div>
      <div className="details-panel" ref={panelRef}>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close details panel"
        >
          ✖
        </button>

        {loading && <Loading />}
        {error && !loading && <ErrorMessage message={error} />}
        {!loading && !error && movie && (
          <>
            <div className="details-header">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="details-poster"
                />
              )}
              <div className="details-info">
                <h2 className="details-title">{movie.title}</h2>
                <div className="details-meta">
                  <strong>Year:</strong> {movie.release_date?.slice(0, 4)}
                </div>
                <div className="details-rating">
                  <Star size={18} fill="#f39c12" stroke="#f39c12" />
                  {movie.vote_average.toFixed(1)} / 10
                </div>
              </div>
            </div>

            <p className="details-overview">{movie.overview}</p>
          </>
        )}
      </div>
    </>
  );
};

export default Details;
