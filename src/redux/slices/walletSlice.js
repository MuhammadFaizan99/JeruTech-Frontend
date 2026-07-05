import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchMyWallet = createAsyncThunk(
  "wallet/fetchMyWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wallet/me");
      return response.data.data.wallet;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load wallet"
      );
    }
  }
);

export const fetchMyWalletTransactions = createAsyncThunk(
  "wallet/fetchMyWalletTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/wallet/me/transactions", {
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ),
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load wallet transactions"
      );
    }
  }
);

export const fetchAllWallets = createAsyncThunk(
  "wallet/fetchAllWallets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wallet");
      return response.data.data.wallets;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load wallets"
      );
    }
  }
);

export const fundUserWallet = createAsyncThunk(
  "wallet/fundUserWallet",
  async ({ userId, amount, description }, { rejectWithValue }) => {
    try {
      const response = await api.post("/wallet/fund", {
        userId,
        amount,
        description,
      });
      return response.data.data.wallet;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fund wallet"
      );
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallet: null,
    transactions: [],
    transactionsPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    },
    allWallets: [],
    loading: false,
    transactionsLoading: false,
    allWalletsLoading: false,
    funding: false,
    error: null,
  },
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
    resetWalletState: (state) => {
      state.wallet = null;
      state.transactions = [];
      state.allWallets = [];
      state.loading = false;
      state.transactionsLoading = false;
      state.allWalletsLoading = false;
      state.funding = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(fetchMyWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMyWalletTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyWalletTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        const payload = action.payload || {};
        state.transactions = payload.transactions ?? [];
        state.transactionsPagination = {
          currentPage: payload.pagination?.currentPage || payload.currentPage || 1,
          totalPages: payload.pagination?.totalPages || payload.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.totalItems || state.transactions.length,
          limit: payload.pagination?.limit || payload.limit || 6,
          hasNextPage: payload.pagination?.hasNextPage ?? payload.hasNextPage ?? false,
          hasPrevPage: payload.pagination?.hasPrevPage ?? payload.hasPrevPage ?? false,
        };
      })
      .addCase(fetchMyWalletTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllWallets.pending, (state) => {
        state.allWalletsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllWallets.fulfilled, (state, action) => {
        state.allWalletsLoading = false;
        state.allWallets = action.payload ?? [];
      })
      .addCase(fetchAllWallets.rejected, (state, action) => {
        state.allWalletsLoading = false;
        state.error = action.payload;
      })

      .addCase(fundUserWallet.pending, (state) => {
        state.funding = true;
        state.error = null;
      })
      .addCase(fundUserWallet.fulfilled, (state, action) => {
        state.funding = false;
        const updated = action.payload;
        const index = state.allWallets.findIndex(
          (wallet) => wallet.userId === updated.userId
        );

        if (index >= 0) {
          state.allWallets[index] = updated;
        } else {
          state.allWallets.unshift(updated);
        }
      })
      .addCase(fundUserWallet.rejected, (state, action) => {
        state.funding = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletError, resetWalletState } = walletSlice.actions;
export default walletSlice.reducer;
