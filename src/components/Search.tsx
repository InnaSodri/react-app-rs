import React, { useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Search.css';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export const Search: React.FC<Props> = ({ onSearch, initialValue }) => {
  const STORAGE_KEY = 'movies-search-term';
  const [searchTerm, setSearchTerm] = useLocalStorage<string>(
    STORAGE_KEY,
    initialValue || ''
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  }, [searchTerm, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      setSearchTerm(trimmedTerm); // Optional: keeps localStorage clean
      onSearch(trimmedTerm);
    }
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
        aria-label="Search movies"
      />
      <button onClick={handleSearch} className="search-button" type="button">
        <SearchIcon className="search-icon" />
        Search
      </button>
    </div>
  );
};
