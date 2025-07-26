import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { About } from '../About';

describe('About Page', () => {
  it('renders heading and content correctly', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /About This App/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/search for movies and explore details/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/React Functional Components/i)
    ).toBeInTheDocument();

    const authorElements = screen.getAllByText(
      (_content, node): node is HTMLElement =>
        node instanceof HTMLElement &&
        node.textContent?.includes('Author: Inna Sodri') === true
    );
    expect(authorElements.length).toBeGreaterThan(0);

    expect(
      screen.getByRole('link', { name: /RS School React course/i })
    ).toHaveAttribute('href', 'https://rs.school/react/');

    expect(screen.getByRole('link', { name: /Back to Home/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
