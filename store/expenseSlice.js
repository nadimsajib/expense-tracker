import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabaseClient";

// Fetch expenses from Supabase
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { getState }) => {
    const userId = getState().auth.user?.id;
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  }
);
// Add expense to Supabase
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense, { getState }) => {
    const userId = getState().auth.user?.id;
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ ...expense, user_id: userId }])
      .select();
    if (error) throw error;
    return data[0];
  }
);

// Delete expense from Supabase
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    return id;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.list = state.list.filter((exp) => exp.id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;
