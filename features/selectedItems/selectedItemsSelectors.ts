import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { SelectedItem } from './selectedItemsSlice';

export const selectSelectedItems = createSelector(
  (state: RootState) => state.selectedItems.items,
  (items): SelectedItem[] => Object.values(items)
);

export const selectSelectedCount = createSelector(
  (state: RootState) => state.selectedItems.items,
  (items) => Object.keys(items).length
);

export const selectIsSelected = (id: string) => (state: RootState) =>
  Boolean(state.selectedItems.items[id]);
