import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import authReducer from './authSlice';
import budgetReducer from './budgetSlice';

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    auth: authReducer,
    budget: budgetReducer,
  },
});
