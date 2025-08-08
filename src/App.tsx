import { Film } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Flyout from './components/Flyout';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './contexts/useTheme';
import './App.css';

export const App = () => {
  const { theme } = useTheme();

  return (
    <div className={`app-wrapper ${theme}`}>
      <main className="app-container">
        <header className="app-header">
          <div className="header-top">
            <Link to="/about" className="about-link">
              About
            </Link>
            <ThemeToggle />
          </div>

          <h1 className="app-title">
            <Film className="film-icon" />
            Movies Search
          </h1>

          <p className="app-subtitle">
            Search for your favorite movies or browse popular titles — built
            with React Functional Components and TheMovieDB API
          </p>
        </header>

        <Outlet />
        <Flyout />
      </main>
    </div>
  );
};

export default App;
