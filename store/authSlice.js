import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabaseClient";

// Sign up
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return null;
});

// Check current session
export const checkSession = createAsyncThunk("auth/checkSession", async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
