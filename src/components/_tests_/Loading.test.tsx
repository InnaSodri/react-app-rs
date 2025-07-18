import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading component', () => {
  test('renders loading text', () => {
    render(<Loading />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
