import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Details from '../Details';
import { Movie } from '../@/types';
import { MemoryRouter } from 'react-router-dom';
import { TestProviders } from '../@/utils/TestProviders';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: 'A mind-bending thriller.',
  poster_path: '/inception.jpg',
  release_date: '2010-07-16',
  vote_average: 8.8,
};

const okJson = (data: unknown) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const errJson = (data: unknown, status = 500) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('Details component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('shows loading initially', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      okJson(mockMovie) as unknown as Response
    );

    render(
      <TestProviders>
        <MemoryRouter>
          <Details movieId={1} onClose={() => {}} />
        </MemoryRouter>
      </TestProviders>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders movie details after fetch', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      okJson(mockMovie) as unknown as Response
    );

    render(
      <TestProviders>
        <MemoryRouter>
          <Details movieId={1} onClose={() => {}} />
        </MemoryRouter>
      </TestProviders>
    );

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
      expect(screen.getByText(/2010/i)).toBeInTheDocument();
      expect(screen.getByText(/8.8 \/ 10/i)).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      errJson({ message: 'fail' }, 500) as unknown as Response
    );

    render(
      <TestProviders>
        <MemoryRouter>
          <Details movieId={999} onClose={() => {}} />
        </MemoryRouter>
      </TestProviders>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /error/i })
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      okJson(mockMovie) as unknown as Response
    );
    const onClose = vi.fn();

    render(
      <TestProviders>
        <MemoryRouter>
          <Details movieId={1} onClose={onClose} />
        </MemoryRouter>
      </TestProviders>
    );

    const closeBtn = await screen.findByRole('button', {
      name: /close details panel/i,
    });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      okJson(mockMovie) as unknown as Response
    );
    const onClose = vi.fn();

    const { container } = render(
      <TestProviders>
        <MemoryRouter>
          <Details movieId={1} onClose={onClose} />
        </MemoryRouter>
      </TestProviders>
    );

    await screen.findByText(/Inception/i);

    const overlay = container.querySelector('.details-overlay');
    if (!overlay) throw new Error('Overlay element not found');
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalled();
  });
});
