import { describe, it, expect } from 'vitest';
import reducer, {
  toggleItem,
  unselectAll,
} from '../../features/selectedItems/selectedItemsSlice';

describe('selectedItemsSlice', () => {
  const initialState = { items: {} };

  const sampleItem = {
    id: '1',
    name: 'Item 1',
    description: 'Desc',
    detailsUrl: '/details/1',
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should toggle an item on', () => {
    const state = reducer(initialState, toggleItem(sampleItem));
    expect(state.items['1']).toEqual(sampleItem);
  });

  it('should toggle an item off if already selected', () => {
    const state = reducer(
      { items: { '1': sampleItem } },
      toggleItem(sampleItem)
    );
    expect(state.items).toEqual({});
  });

  it('should clear all selected items', () => {
    const state = reducer(
      { items: { '1': sampleItem, '2': sampleItem } },
      unselectAll()
    );
    expect(state.items).toEqual({});
  });
});
