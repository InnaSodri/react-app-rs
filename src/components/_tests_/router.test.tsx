import { render } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../../router';

test('renders app with router', () => {
  render(<RouterProvider router={router} />);
});
