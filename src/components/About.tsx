import React from 'react';

export const About: React.FC = () => (
  <main style={{ padding: '1rem' }}>
    <h2>About This App</h2>
    <p>Author: Inna Sodri</p>
    <p>
      This project is made for the RS School React course. Learn more{' '}
      <a href="https://rs.school/react/" target="_blank" rel="noreferrer">
        here
      </a>
      .
    </p>
  </main>
);
