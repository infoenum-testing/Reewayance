// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../../services/authService";

// 🔹 Async Thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await AuthService.login(email, password);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  }
);

export const checkCurrentUser = createAsyncThunk(
  "auth/checkCurrentUser",
  async () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    }
    return null;
  }
);

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

      // Check current user
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
