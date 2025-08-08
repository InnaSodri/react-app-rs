import React from 'react';
import { Link } from 'react-router-dom';
import './styles/About.css';

export const About: React.FC = () => (
  <main className="about-container">
    <header className="about-header">
      <h2>About This App</h2>
    </header>

    <section className="about-content">
      <p>
        This application allows users to search for movies and explore details
        using TheMovieDB API.
      </p>
      <p>
        Built with <strong>React Functional Components</strong>, this app
        leverages React hooks for state management and navigation, making it a
        modern and efficient single-page application.
      </p>
      <p>
        <strong>Author:</strong> Inna Sodri
      </p>
      <p>
        This project is made as part of the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>
        .
      </p>
    </section>

    <section className="about-navigation">
      <Link to="/" className="back-home-link">
        Back to Home
      </Link>
    </section>
  </main>
);
