import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div>
    <h3>Error</h3>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
