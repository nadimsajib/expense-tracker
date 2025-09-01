import { useState } from "react";
import { useDispatch } from "react-redux";
import { addExpense } from "../store/expenseSlice";
import { deductFunds } from "../store/balanceSlice";

export default function ExpenseForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [source, setSource] = useState("cash_in_hand");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    dispatch(
      addExpense({
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString().split("T")[0],
      })
    );
    setDescription("");
    setAmount("");
    setCategory("General");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option>General</option>
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Entertainment</option>
        <option>Other</option>
      </select>
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="cash_in_hand">Cash in Hand</option>
        <option value="cash_in_bank">Cash in Bank</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
}
