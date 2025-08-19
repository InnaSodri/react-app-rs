"use client";
import React from 'react';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { toggleItem } from '@/features/selectedItems/selectedItemsSlice';
import { selectIsSelected } from '@/features/selectedItems/selectedItemsSelectors';
import { Movie } from '@/types';
import '@/components/styles/Card.css';

interface Props {
  movie: Movie;
  onClick?: (id: number) => void;
}

export default function Card({ movie, onClick }: Props) {
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsSelected(String(movie.id)));

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(
      toggleItem({
        id: String(movie.id),
        name: movie.title,
        description: movie.overview || 'No description available.',
        detailsUrl: `https://www.themoviedb.org/movie/${movie.id}`
      })
    );
  };

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const pillClass = `select-pill${isSelected ? ' is-selected' : ''}`;

  return (
    <div className="card" onClick={() => onClick?.(movie.id)} data-testid="card">
      <div className="card-image">
        <Image
          src={imageUrl}
          alt={`Poster of ${movie.title}`}
          width={500}
          height={750}
          loading="lazy"
        />
        <span className="vote-badge">
          ⭐ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{movie.title}</h3>
        <p className="card-overview">{movie.overview || 'No description available.'}</p>

        <div className="card-meta">
          <Calendar />
          <span className="release-year">{releaseYear}</span>
        </div>

        <label
          className={pillClass}
          onClick={(e) => e.stopPropagation()}
          aria-pressed={isSelected}
        >
          <input type="checkbox" checked={isSelected} onChange={handleToggle} />
          <span className="dot" />
          <span className="text">{isSelected ? 'Selected' : 'Select'}</span>
        </label>
      </div>
    </div>
  );
}
