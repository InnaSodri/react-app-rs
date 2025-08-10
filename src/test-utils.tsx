import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeProvider';

const AllProviders = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider>{children}</ThemeProvider>
  </Provider>
);

export const customRender = (ui: React.ReactElement, options = {}) => {
  return {
    ...render(ui, { wrapper: AllProviders, ...options }),
    store,
  };
};

export * from '@testing-library/react';
