import { Outlet, Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import Flyout from './components/Flyout';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

export const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <Film className="film-icon" />
          Movies Search
        </h1>
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
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
      <Flyout />
    </main>
  );
};

export default App;
