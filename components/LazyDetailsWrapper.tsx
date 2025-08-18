"use client";
import React, { lazy, Suspense } from 'react';
import type { DetailsProps } from './Details';

const LazyDetails = lazy(() => import('./Details'));

const LazyDetailsWrapper: React.FC<DetailsProps> = ({ movieId, onClose }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyDetails key={movieId} movieId={movieId} onClose={onClose} />
    </Suspense>
  );
};

export default LazyDetailsWrapper;
