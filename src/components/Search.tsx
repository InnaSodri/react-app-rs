import React, { useEffect, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import './Search.css';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export const Search: React.FC<Props> = ({ onSearch, initialValue }) => {
  const STORAGE_KEY = 'movies-search-term';
  const [searchTerm, setSearchTerm] = useState(() => {
    return initialValue || localStorage.getItem(STORAGE_KEY) || '';
  });

  useEffect(() => {
    if (searchTerm) {
      onSearch(searchTerm);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    const term = searchTerm.trim();
    localStorage.setItem(STORAGE_KEY, term);
    onSearch(term);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search movies..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        <SearchIcon className="search-icon" />
        Search
      </button>
    </div>
  );
};
