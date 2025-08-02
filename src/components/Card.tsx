import React from 'react';
import { Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleItem } from '../features/selectedItems/selectedItemsSlice';
import { selectIsSelected } from '../features/selectedItems/selectedItemsSelectors';
import { Movie } from '../types';
import './Card.css';

interface Props {
  movie: Movie;
  onClick?: (id: number) => void;
}

const Card: React.FC<Props> = ({ movie, onClick }) => {
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsSelected(String(movie.id)));

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const payload = {
      id: String(movie.id),
      name: movie.title,
      description: movie.overview || 'No description available.',
      detailsUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    };

    dispatch(toggleItem(payload));
  };

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
      onClick={() => onClick?.(movie.id)}
      data-testid="card"
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

        {/* ✅ Checkbox */}
        <label className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            onClick={(e) => e.stopPropagation()}
          />
          Select
        </label>
      </div>
    </div>
  );
};

export default Card;
