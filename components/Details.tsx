"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { useGetMovieDetailsQuery } from "@/services/tmdbApi";
import { Loading } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import "@/components/styles/Details.css";
import { useLocale } from "next-intl";

export interface DetailsProps {
  movieId: number;
  onClose: () => void;
}

export default function Details({ movieId, onClose }: DetailsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const { data: movie, isLoading, isError, error } = useGetMovieDetailsQuery(
    { id: String(movieId), locale },
    { skip: !movieId }
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener("click", handleClickOutside);
    });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div className="details-overlay" />
      <div className="details-panel" ref={panelRef}>
        <button className="close-button" onClick={onClose} aria-label="Close details panel">
          ✖
        </button>

        {isLoading && <Loading />}

        {isError && !isLoading && (
          <ErrorMessage message={(error as Error)?.message ?? "Error"} />
        )}

        {!isLoading && !isError && movie && (
          <>
            <div className="details-header">
              {movie.poster_path && (
                <Image
                  width={240}
                  height={290}
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title ?? ""}
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
                  {typeof movie?.vote_average === "number"
                    ? `${movie.vote_average.toFixed(1)} / 10`
                    : "No rating"}
                </div>
              </div>
            </div>

            <p className="details-overview">{movie.overview}</p>
          </>
        )}
      </div>
    </>
  );
}
