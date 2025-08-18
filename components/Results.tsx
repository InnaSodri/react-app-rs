"use client";
import React from "react";
import Card from "@/components/Card";
import type { Movie } from "@/types";
import "@/components/styles/Results.css";

type Props = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onCardClick: (id: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelect?: (m: Movie) => void;
};

export function Results({
  movies,
  loading,
  error,
  onCardClick,
  currentPage,
  onPageChange,
}: Props) {
  if (loading) return <div className="results-empty">Loading…</div>;
  if (error) return <div className="results-empty">{error}</div>;
  if (!movies?.length) return <div className="results-empty">No results.</div>;

  return (
    <div className="results-container">
      <div className="results-scroller" data-testid="results-grid">
        {movies.map((m) => (
          <div key={m.id} className="results-item">
            <Card movie={m} onClick={onCardClick} />
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <span className="current-page">Page {currentPage}</span>
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
