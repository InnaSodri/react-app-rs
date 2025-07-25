import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/Movies Search/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const inputElement = screen.getByPlaceholderText(/Search movies/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('shows loader when loading is true', async () => {
    render(
      <MemoryRouter initialEntries={['/?search=avatar']}>
        <App />
      </MemoryRouter>
    );

    const loader = await screen.findByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  it('navigates to About page', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    const aboutHeading = await screen.findByText(/About This App/i); // FIXED
    expect(aboutHeading).toBeInTheDocument();
  });

  it('renders 404 for unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-page']}>
        <App />
      </MemoryRouter>
    );
    const notFoundText = await screen.findByText(/404 - Page Not Found/i); // FIXED
    expect(notFoundText).toBeInTheDocument();
  });
});
