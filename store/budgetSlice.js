import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabaseClient";

// Fetch budget for current month
export const fetchBudget = createAsyncThunk(
  "budget/fetchBudget",
  async (_, { getState }) => {
    const userId = getState().auth.user?.id;
    const month = new Date().toISOString().slice(0, 7);
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .single();
    if (error && error.code !== "PGRST116") throw error; // ignore "no rows" error
    return data || { amount: 0, month };
  }
);

// Set or update budget
export const setBudget = createAsyncThunk(
  "budget/setBudget",
  async (amount, { getState }) => {
    const userId = getState().auth.user?.id;
    const month = new Date().toISOString().slice(0, 7);

    // Check if budget exists
    const { data: existing } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .single();

    let data, error;
    if (existing) {
      ({ data, error } = await supabase
        .from("budgets")
        .update({ amount })
        .eq("id", existing.id)
        .select()
        .single());
    } else {
      ({ data, error } = await supabase
        .from("budgets")
        .insert([{ user_id: userId, amount, month }])
        .select()
        .single());
    }

    if (error) throw error;
    return data;
  }
);

const budgetSlice = createSlice({
  name: "budget",
  initialState: { amount: 0, month: "", status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.amount = action.payload.amount || 0;
        state.month = action.payload.month;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.amount = action.payload.amount;
        state.month = action.payload.month;
      });
  },
});

export default budgetSlice.reducer;
