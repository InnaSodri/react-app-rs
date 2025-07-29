import { render, screen } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading component', () => {
  test('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('has the loader test id', () => {
    render(<Loading />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
