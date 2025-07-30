import { RootState } from '../../app/store';

export const selectSelectedItems = (state: RootState) =>
  Object.values(state.selectedItems.items);

export const selectIsSelected = (id: string) => (state: RootState) =>
  Boolean(state.selectedItems.items[id]);

export const selectSelectedCount = (state: RootState) =>
  Object.keys(state.selectedItems.items).length;
