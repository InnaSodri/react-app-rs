import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from '../@/features/selectedItems/selectedItemsSlice';
import { ThemeProvider } from '../@/contexts/';
import Flyout from '../Flyout';
import { describe, it, expect, vi, beforeEach } from 'vitest';

function renderWithProviders(
  ui: React.ReactElement,
  store: ReturnType<typeof configureStore>
) {
  return render(
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>
  );
}

describe('Flyout Component', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('does not render when no items are selected', () => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: { selectedItems: { items: {} } },
    });

    const { container } = renderWithProviders(<Flyout />, store);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders selected item count and unselects items', () => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: {
        selectedItems: {
          items: {
            '1': {
              id: '1',
              name: 'Test Movie',
              description: 'A movie for testing.',
              detailsUrl: 'https://example.com',
            },
          },
        },
      },
    });

    renderWithProviders(<Flyout />, store);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/unselect all/i));
    expect(store.getState().selectedItems.items).toEqual({});
  });

  it('shows plural label when multiple items are selected', () => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: {
        selectedItems: {
          items: {
            '1': {
              id: '1',
              name: 'Movie One',
              description: 'First movie.',
              detailsUrl: 'https://example.com/1',
            },
            '2': {
              id: '2',
              name: 'Movie Two',
              description: 'Second movie.',
              detailsUrl: 'https://example.com/2',
            },
          },
        },
      },
    });

    renderWithProviders(<Flyout />, store);
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
  });

  it('downloads CSV when download button is clicked', () => {
    const store = configureStore({
      reducer: { selectedItems: selectedItemsReducer },
      preloadedState: {
        selectedItems: {
          items: {
            '1': {
              id: '1',
              name: 'Test Movie',
              description: 'A movie for testing.',
              detailsUrl: 'https://example.com',
            },
          },
        },
      },
    });

    const spy = vi.spyOn(document, 'createElement');

    renderWithProviders(<Flyout />, store);

    const anchor = document.createElement('a');
    const clickSpy = vi.spyOn(anchor, 'click');
    spy.mockReturnValue(anchor);

    fireEvent.click(screen.getByText(/download/i));
    expect(clickSpy).toHaveBeenCalled();
  });
});
