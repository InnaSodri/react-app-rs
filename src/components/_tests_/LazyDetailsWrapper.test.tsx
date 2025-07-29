import { render, screen, waitFor } from '@testing-library/react';
import LazyDetailsWrapper from '../LazyDetailsWrapper';

vi.mock('../Details', () => ({
  default: ({ movieId }: { movieId: number }) => (
    <div>Mocked Details for movie {movieId}</div>
  ),
}));

describe('LazyDetailsWrapper', () => {
  it('renders fallback and then lazy loads the details', async () => {
    render(<LazyDetailsWrapper movieId={42} onClose={() => {}} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText(/mocked details for movie 42/i)
      ).toBeInTheDocument()
    );
  });
});
