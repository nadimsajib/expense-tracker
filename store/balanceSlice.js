import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabaseClient";

// Fetch balance
export const fetchBalance = createAsyncThunk(
  "balance/fetchBalance",
  async ({ month }, { getState }) => {
    const userId = getState().auth.user?.id;
    const { data, error } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || { cash_in_hand: 0, cash_in_bank: 0 };
  }
);

// Add funds
export const addFunds = createAsyncThunk(
  "balance/addFunds",
  async ({ type, amount, month }, { getState }) => {
    const userId = getState().auth.user?.id;
    const { data: existing } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .single();

    let updateData = {};
    if (type === "cash_in_hand") {
      updateData.cash_in_hand = (existing?.cash_in_hand || 0) + amount;
      updateData.cash_in_bank = existing?.cash_in_bank || 0;
    } else {
      updateData.cash_in_bank = (existing?.cash_in_bank || 0) + amount;
      updateData.cash_in_hand = existing?.cash_in_hand || 0;
    }

    let res;
    if (existing) {
      res = await supabase
        .from("balances")
        .update(updateData)
        .eq("user_id", userId)
        .eq("month", month)
        .select()
        .single();
    } else {
      res = await supabase
        .from("balances")
        .insert([{ user_id: userId, month, ...updateData }])
        .select()
        .single();
    }
    if (res.error) throw res.error;
    return res.data;
  }
);

// Deduct funds when expense is added
export const deductFunds = createAsyncThunk(
  "balance/deductFunds",
  async ({ type, amount, month }, { getState }) => {
    const userId = getState().auth.user?.id;
    const { data: existing } = await supabase
      .from("balances")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month)
      .single();

    let updateData = {};
    if (type === "cash_in_hand") {
      updateData.cash_in_hand = (existing?.cash_in_hand || 0) - amount;
      updateData.cash_in_bank = existing?.cash_in_bank || 0;
    } else {
      updateData.cash_in_bank = (existing?.cash_in_bank || 0) - amount;
      updateData.cash_in_hand = existing?.cash_in_hand || 0;
    }

    const { data, error } = await supabase
      .from("balances")
      .update(updateData)
      .eq("user_id", userId)
      .eq("month", month)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: { cash_in_hand: 0, cash_in_bank: 0, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.cash_in_hand = action.payload.cash_in_hand;
        state.cash_in_bank = action.payload.cash_in_bank;
      })
      .addCase(addFunds.fulfilled, (state, action) => {
        state.cash_in_hand = action.payload.cash_in_hand;
        state.cash_in_bank = action.payload.cash_in_bank;
      })
      .addCase(deductFunds.fulfilled, (state, action) => {
        state.cash_in_hand = action.payload.cash_in_hand;
        state.cash_in_bank = action.payload.cash_in_bank;
      });
  },
});

export default balanceSlice.reducer;
