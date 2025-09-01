import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFunds } from "../store/balanceSlice";

export default function AddFundsForm() {
  const [type, setType] = useState("cash_in_hand");
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    dispatch(addFunds({ type, amount: parseFloat(amount) }));
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="cash_in_hand">Cash in Hand</option>
        <option value="cash_in_bank">Cash in Bank</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  );
}
