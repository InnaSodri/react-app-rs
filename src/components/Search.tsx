import React, { Component } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

interface State {
  searchTerm: string;
}

export class Search extends Component<Props, State> {
  private STORAGE_KEY = 'movies-search-term';

  constructor(props: Props) {
    super(props);
    const savedTerm = localStorage.getItem(this.STORAGE_KEY) || '';
    this.state = {
      searchTerm: props.initialValue || savedTerm,
    };
  }

  componentDidMount() {
    if (this.state.searchTerm) {
      this.props.onSearch(this.state.searchTerm);
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearch = () => {
    const term = this.state.searchTerm.trim();
    localStorage.setItem(this.STORAGE_KEY, term);
    this.props.onSearch(term);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    return (
      <div className="search-container">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Search movies..."
          className="search-input"
        />
        <button onClick={this.handleSearch} className="search-button">
          <SearchIcon className="search-icon" />
          Search
        </button>
      </div>
    );
  }
}
