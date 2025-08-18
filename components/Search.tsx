"use client";
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import './styles/Search.css';

const STORAGE_KEY = 'movies-search-term';

interface Props {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export const Search: React.FC<Props> = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      onSearch(trimmed);
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
        value={inputValue}
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
