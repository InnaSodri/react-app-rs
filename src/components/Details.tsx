import { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useGetMovieDetailsQuery } from '../services/tmdbApi';
import { Loading } from './Loading';
import ErrorMessage from './ErrorMessage';
import './styles/Details.css';

export interface DetailsProps {
  movieId: number;
  onClose: () => void;
}

const Details: React.FC<DetailsProps> = ({ movieId, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useGetMovieDetailsQuery(String(movieId), {
    skip: !movieId,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClickOutside);
    };
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

        {isLoading && <Loading />}
        {isError && !isLoading && (
          <ErrorMessage message={(error as Error).message} />
        )}
        {!isLoading && !isError && movie && (
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
                  {typeof movie?.vote_average === 'number'
                    ? `${movie.vote_average.toFixed(1)} / 10`
                    : 'No rating'}
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
