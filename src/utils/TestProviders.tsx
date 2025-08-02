import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { ThemeProvider } from '../contexts/ThemeContext';

interface Props {
  children: ReactNode;
}

export const TestProviders = ({ children }: Props) => (
  <Provider store={store}>
    <ThemeProvider>{children}</ThemeProvider>
  </Provider>
);
