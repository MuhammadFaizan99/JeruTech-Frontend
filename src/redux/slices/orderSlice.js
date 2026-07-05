import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
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

export const approveOrder = createAsyncThunk(
  "orders/approveOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/approve`);
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve order"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        orderStatus,
      });
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    adminOrders: [],
    loading: false,
    updating: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetAdminOrders: (state) => {
      state.adminOrders = [];
      state.loading = false;
      state.updating = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};
        state.adminOrders = payload.data ?? [];
        state.pagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || state.adminOrders.length,
          limit: payload.pagination?.limit || payload.limit || 6,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approveOrder.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(approveOrder.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;
        const index = state.adminOrders.findIndex(
          (order) => order._id === updated._id
        );

        if (index >= 0) {
          state.adminOrders[index] = updated;
        }
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;
        const index = state.adminOrders.findIndex(
          (order) => order._id === updated._id
        );

        if (index >= 0) {
          state.adminOrders[index] = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, resetAdminOrders } = orderSlice.actions;
export default orderSlice.reducer;
