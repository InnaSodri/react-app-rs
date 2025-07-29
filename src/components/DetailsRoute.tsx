import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Details from './Details';

const DetailsRoute: React.FC = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  if (!movieId) return null;

  const handleClose = () => {
    navigate({ pathname: '/', search: location.search });
  };

  return <Details movieId={Number(movieId)} onClose={handleClose} />;
};

export default DetailsRoute;
