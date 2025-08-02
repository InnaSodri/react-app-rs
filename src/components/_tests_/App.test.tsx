import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { TestProviders } from '../../utils/TestProviders';

describe('App component', () => {
  it('renders the title and subtitle', () => {
    render(
      <TestProviders>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </TestProviders>
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
      <TestProviders>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </TestProviders>
    );

    expect(document.querySelector('.app-container')).toBeInTheDocument();
  });
});
