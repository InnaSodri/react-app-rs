import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Details from '../Details';
import { Movie } from '../../types';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: 'A mind-bending thriller.',
  poster_path: '/inception.jpg',
  release_date: '2010-07-16',
  vote_average: 8.8,
};

const mockFetch = (
  response: Partial<Response> & { json: () => Promise<Movie> }
) => {
  vi.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    ...response,
  } as Response);
};

describe('Details component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading initially', async () => {
    mockFetch({ json: async () => mockMovie });

    render(<Details movieId={1} onClose={() => {}} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders movie details after fetch', async () => {
    mockFetch({ json: async () => mockMovie });

    render(<Details movieId={1} onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
      expect(screen.getByText(/2010/i)).toBeInTheDocument();
      expect(screen.getByText(/8.8 \/ 10/i)).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    render(<Details movieId={1} onClose={() => {}} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch movie details/i)
      ).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    mockFetch({ json: async () => mockMovie });
    const onClose = vi.fn();

    render(<Details movieId={1} onClose={onClose} />);

    const closeBtn = await screen.findByRole('button', {
      name: /close details panel/i,
    });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', async () => {
    mockFetch({ json: async () => mockMovie });
    const onClose = vi.fn();

    const { container } = render(<Details movieId={1} onClose={onClose} />);

    // Wait for movie title to ensure loading is complete
    await screen.findByText(/Inception/i);

    const overlay = container.querySelector('.details-overlay');

    if (overlay) {
      fireEvent.click(overlay);
    } else {
      console.log(container.innerHTML); // helpful for debugging
      throw new Error('Overlay element not found');
    }

    expect(onClose).toHaveBeenCalled();
  });
});
