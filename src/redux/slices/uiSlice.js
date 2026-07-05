import { createSlice } from "@reduxjs/toolkit";

const MAX_COMPARE = 2;

const initialState = {
  quickViewProduct: null,
  compareItems: [],
  compareOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setQuickViewProduct: (state, action) => {
      state.quickViewProduct = action.payload;
    },
    clearQuickViewProduct: (state) => {
      state.quickViewProduct = null;
    },
    toggleCompareProduct: (state, action) => {
      const product = action.payload;
      const exists = state.compareItems.find((p) => p.id === product.id);
      if (exists) {
        state.compareItems = state.compareItems.filter((p) => p.id !== product.id);
      } else if (state.compareItems.length < MAX_COMPARE) {
        state.compareItems.push(product);
      }
    },
    removeCompareProduct: (state, action) => {
      state.compareItems = state.compareItems.filter((p) => p.id !== action.payload);
    },
    clearCompareProducts: (state) => {
      state.compareItems = [];
      state.compareOpen = false;
    },
    setCompareOpen: (state, action) => {
      state.compareOpen = action.payload;
    },
  },
});

export const {
  setQuickViewProduct,
  clearQuickViewProduct,
  toggleCompareProduct,
  removeCompareProduct,
  clearCompareProducts,
  setCompareOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
