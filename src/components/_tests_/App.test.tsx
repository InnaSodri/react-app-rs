import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
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

  it('renders the search component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const inputElement = screen.getByPlaceholderText(/Search/i); // more flexible match
    expect(inputElement).toBeInTheDocument();
  });

  it('renders loading spinner when searching', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search/i);
    input.focus();
    await waitFor(() =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    );

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  it('renders error boundary on button click', async () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </MemoryRouter>
    );

    const errorButton = screen.getByText(/Test Error/i);
    errorButton.click();

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
