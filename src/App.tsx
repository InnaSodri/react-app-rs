import React, { Component } from 'react';
import { Film } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Search } from './components/Search';
import { Results } from './components/Results';
import './App.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MoviesResponse {
  results: Movie[];
}

interface State {
  searchTerm: string;
  movies: Movie[];
  loading: boolean;
  error: string | null;
  shouldThrowError: boolean;
}

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

export class App extends Component<Record<string, never>, State> {
  state: State = {
    searchTerm: '',
    movies: [],
    loading: false,
    error: null,
    shouldThrowError: false,
  };

  componentDidMount() {
    this.fetchMovies('');
  }

  private buildUrl(term: string): string {
    return term.trim()
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(term)}&page=1`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
  }

  fetchMovies = async (term: string) => {
    this.setState({ loading: true, error: null, searchTerm: term });

    try {
      const url = this.buildUrl(term);
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data: MoviesResponse = await response.json();

      if (data.results.length === 0 && term.trim()) {
        throw new Error(`No movies found for "${term}"`);
      }

      this.setState({ movies: data.results, error: null });
    } catch (err) {
      this.setState({
        error:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        movies: [],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleTestError = (): void => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error(
        'Test error thrown by user - Error Boundary should catch this!'
      );
    }

    return (
      <ErrorBoundary>
        <main className="app-container">
          <header className="app-header">
            <h1 className="app-title">
              <Film className="film-icon" />
              Movies Search
            </h1>
            <p className="app-subtitle">
              Search for your favorite movies or browse popular titles — built
              with React Class Components and TheMovieDB API
            </p>
          </header>

          <Search
            onSearch={this.fetchMovies}
            initialValue={this.state.searchTerm}
          />
          <Results
            movies={this.state.movies}
            loading={this.state.loading}
            error={this.state.error}
          />

          <button className="test-error-btn" onClick={this.handleTestError}>
            Test Error
          </button>
        </main>
      </ErrorBoundary>
    );
  }
}

export default App;
