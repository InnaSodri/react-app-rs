import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: string;
  name: string;
  description: string;
  detailsUrl: string;
}

interface SelectedItemsState {
  items: Record<string, Item>;
}

const initialState: SelectedItemsState = {
  items: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<Item>) {
      const id = action.payload.id;
      if (state.items[id]) {
        const rest = Object.fromEntries(
          Object.entries(state.items).filter(([key]) => key !== id)
        );
        state.items = rest;
      } else {
        state.items[id] = action.payload;
      }
    },
    unselectAll(state) {
      state.items = {};
    },
  },
});

export const { toggleItem, unselectAll } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
