import React from 'react';
import { Calendar } from 'lucide-react';
import { Movie } from '../types';
import './Card.css';

interface Props {
  movie: Movie;
  onClick?: () => void;
}

const Card: React.FC<Props> = ({ movie, onClick }) => {
  const getImageUrl = (posterPath: string | null): string =>
    posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'TBA';

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="card-image">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={`Poster of ${movie.title}`}
          loading="lazy"
        />
        <span className="vote-badge">
          ⭐{' '}
          {typeof movie.vote_average === 'number'
            ? movie.vote_average.toFixed(1)
            : 'N/A'}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{movie.title}</h3>
        <p className="card-overview">
          {movie.overview || 'No description available.'}
        </p>
        <div className="card-meta">
          <Calendar />
          <span className="release-year">{releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
