import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App component', () => {
  it('renders the title and subtitle', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Movies Search/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Search for your favorite movies or browse popular titles/i
      )
    ).toBeInTheDocument();
  });

  it('renders an Outlet placeholder', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(document.querySelector('.app-container')).toBeInTheDocument();
  });
});
