import { Outlet, Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import './App.css';

export const App = () => {
  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <Film className="film-icon" />
          Movies Search
        </h1>
        <p className="app-subtitle">
          Search for your favorite movies or browse popular titles — built with
          React Functional Components and TheMovieDB API
        </p>
        <nav>
          <Link to="/about" className="about-link">
            About
          </Link>
        </nav>
      </header>

      <Outlet />
    </main>
  );
};

export default App;
