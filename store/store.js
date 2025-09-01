import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";
import authReducer from "./authSlice";
import budgetReducer from "./budgetSlice";
import balanceReducer from "./balanceSlice";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    auth: authReducer,
    budget: budgetReducer,
    balance: balanceReducer,
  },
});
