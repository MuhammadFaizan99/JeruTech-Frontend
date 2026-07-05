import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token,
  isAuthenticated: !!token,
  loading: false,
  profileLoading: false,
  profileSaving: false,
  profileDeleting: false,
  error: null,
};

// Register
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (
    { customerName, phoneNumber, address, email, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", {
        customerName,
        phoneNumber,
        address,
        email,
        password,
      });

      const { user, token } = response.data.data;

      localStorage.setItem("token", token);

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data.data;

      if (user?.role !== "customer") {
        return rejectWithValue(
          "This login is for customers only. Please use the customer sign in page only if you have a customer account."
        );
      }

      localStorage.setItem("token", token);

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);

// Admin Login
export const signInAdmin = createAsyncThunk(
  "auth/signInAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/admin/login", {
        email,
        password,
      });

      const { user, token } = response.data.data;

      if (user?.role !== "admin") {
        return rejectWithValue("Admin access only");
      }

      localStorage.setItem("token", token);

      return { user, token };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid admin credentials"
      );
    }
  }
);

// Get Current Profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile");

      return response.data.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to load profile",
        status: error.response?.status,
      });
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      const { user, token } = response.data.data;
      const nextToken = token || localStorage.getItem("token");

      if (nextToken) {
        localStorage.setItem("token", nextToken);
      }

      return { user, token: nextToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Delete Account
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/auth/profile");
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    signOutUser: (state) => {
      localStorage.removeItem("token");

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADMIN LOGIN
      .addCase(signInAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signInAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        const payload = action.payload;
        state.error =
          typeof payload === "string" ? payload : payload?.message || null;

        const shouldClearSession =
          typeof payload === "object" &&
          payload?.status &&
          [401, 404].includes(payload.status);

        if (shouldClearSession) {
          localStorage.removeItem("token");

          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.profileSaving = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileSaving = false;
        state.user = action.payload.user;
        state.token = action.payload.token || state.token;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileSaving = false;
        state.error = action.payload;
      })

      // DELETE ACCOUNT
      .addCase(deleteAccount.pending, (state) => {
        state.profileDeleting = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profileDeleting = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.profileDeleting = false;
        state.error = action.payload;
      });
  },
});

export const { signOutUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;