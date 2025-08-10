import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '../contexts/ThemeProvider';

interface Props {
  children: ReactNode;
}

export const TestProviders = ({ children }: Props) => (
  <Provider store={store}>
    <ThemeProvider>{children}</ThemeProvider>
  </Provider>
);
