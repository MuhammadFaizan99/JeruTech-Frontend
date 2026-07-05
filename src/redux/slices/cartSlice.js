import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const emptyCartState = {
  cartItems: [],
  cartCount: 0,
  subtotal: 0,
  tax: 0,
  taxRate: 0,
  taxName: "",
  taxLoaded: false,
  deliveryFeeAmount: 0,
  deliveryFee: 0,
  total: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const initialState = {
  ...emptyCartState,
  loading: false,
  settingsLoading: false,
  mutating: false,
  placingOrder: false,
  error: null,
};

const normalizeTaxRate = (value) => {
  const numericValue = Number(value) || 0;
  return numericValue > 1 ? numericValue / 100 : numericValue;
};

const mapApiCart = (cart) => {
  if (!cart) {
    return { ...emptyCartState, taxLoaded: true };
  }

  return {
    cartItems: (cart.items ?? []).map((item) => ({
      itemId: item._id,
      cartKey: item.cartKey,
      id: item.productId,
      name: item.name,
      category: item.category,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      discounted: item.discounted,
      discount: item.discount,
      quantity: item.quantity,
      stock: item.stock,
      lineTotal: item.lineTotal,
    })),
    cartCount: cart.cartCount ?? 0,
    subtotal: cart.subtotal ?? 0,
    tax: cart.tax ?? 0,
    taxRate: normalizeTaxRate(cart.taxRate ?? 0),
    taxLoaded: true,
    deliveryFee: cart.deliveryFee ?? 0,
    total: cart.total ?? 0,
    pagination: cart.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalItems: (cart.items ?? []).length,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
};

const applyCartPayload = (state, cart) => {
  const mapped = mapApiCart(cart);
  Object.assign(state, mapped);
};

export const fetchCheckoutSettings = createAsyncThunk(
  "cart/fetchCheckoutSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/amount");
      return response.data.data.amount;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load checkout settings"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart", {
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ),
      });
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post("/cart", { productId, quantity });
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (itemId, { getState, rejectWithValue }) => {
    const item = getState().cart.cartItems.find(
      (cartItem) => cartItem.itemId === itemId
    );

    if (!item) {
      return rejectWithValue("Cart item not found");
    }

    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity: item.quantity + 1,
      });
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (itemId, { getState, rejectWithValue }) => {
    const item = getState().cart.cartItems.find(
      (cartItem) => cartItem.itemId === itemId
    );

    if (!item) {
      return rejectWithValue("Cart item not found");
    }

    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity: item.quantity - 1,
      });
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete("/cart/clear");
      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async ({ paymentMethod = "Cash on Delivery" } = {}, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders", { paymentMethod });
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

export const fetchPurchasedItems = createAsyncThunk(
  "cart/fetchPurchasedItems",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/purchased-items", {
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load purchased items"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "cart/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders", {
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    ...initialState,
    orders: [],
    ordersLoading: false,
    purchasedItemsLoading: false,
    purchasedItems: [],
    purchasedItemsPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    },
    ordersPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  reducers: {
    resetCart: (state) => {
      const { taxRate, taxName, taxLoaded, deliveryFeeAmount } = state;

      Object.assign(state, {
        ...emptyCartState,
        taxRate,
        taxName,
        taxLoaded,
        deliveryFeeAmount,
        loading: false,
        settingsLoading: false,
        mutating: false,
        placingOrder: false,
        error: null,
        orders: [],
        ordersLoading: false,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckoutSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(fetchCheckoutSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.taxRate = normalizeTaxRate(action.payload?.TAX_RATE ?? 0);
        state.deliveryFeeAmount = action.payload?.DELIVERY_FEE ?? 0;
        state.taxName = "";
        state.taxLoaded = true;
      })
      .addCase(fetchCheckoutSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload;
        state.taxLoaded = true;
      })

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.taxLoaded = true;
      })

      .addCase(addToCart.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.mutating = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(increaseQuantity.pending, (state) => {
        state.mutating = true;
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(decreaseQuantity.pending, (state) => {
        state.mutating = true;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.mutating = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(clearCart.pending, (state) => {
        state.mutating = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.mutating = false;
        applyCartPayload(state, action.payload);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.placingOrder = false;
        const { taxRate, taxName, taxLoaded, deliveryFeeAmount } = state;

        Object.assign(state, {
          ...emptyCartState,
          taxRate,
          taxName,
          taxLoaded,
          deliveryFeeAmount,
        });
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })

      .addCase(fetchPurchasedItems.pending, (state) => {
        state.purchasedItemsLoading = true;
      })
      .addCase(fetchPurchasedItems.fulfilled, (state, action) => {
        state.purchasedItemsLoading = false;
        const payload = action.payload || {};
        state.purchasedItems = payload.data ?? [];
        state.purchasedItemsPagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || state.purchasedItems.length,
          limit: payload.pagination?.limit || payload.limit || 6,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchPurchasedItems.rejected, (state, action) => {
        state.purchasedItemsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        const payload = action.payload || {};
        state.orders = payload.data ?? [];
        state.ordersPagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || state.orders.length,
          limit: payload.pagination?.limit || payload.limit || 6,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
