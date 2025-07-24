import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { Loading } from './Loading';
import ErrorMessage from './ErrorMessage';
import './Details.css';

interface DetailsProps {
  movieId: number;
  onClose: () => void;
}

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/movie';

const Details: React.FC<DetailsProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/${movieId}?api_key=${API_KEY}`);
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

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!movie) return null;

  return (
    <div className="details-panel">
      <button className="close-button" onClick={onClose}>
        ✖
      </button>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> ⭐ {movie.vote_average}
      </p>
    </div>
  );
};

export default Details;
