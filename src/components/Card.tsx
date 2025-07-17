import React, { Component } from 'react';
import { Calendar } from 'lucide-react';
import './Card.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string | null;
}

interface Props {
  movie: Movie;
}

export class Card extends Component<Props> {
  getImageUrl(posterPath: string | null): string {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0';
  }

  render() {
    const { movie } = this.props;
    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'TBA';

    return (
      <div className="card">
        <div className="card-image">
          <img
            src={this.getImageUrl(movie.poster_path)}
            alt={`Poster of ${movie.title}`}
            loading="lazy"
          />
          <span className="vote-badge">⭐ {movie.vote_average.toFixed(1)}</span>
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
  }
}

export default Card;
