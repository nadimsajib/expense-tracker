import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget, setBudget } from "../store/budgetSlice";

export default function BudgetForm() {
  const dispatch = useDispatch();
  const { amount } = useSelector((state) => state.budget);
  const [newAmount, setNewAmount] = useState(amount);

  useEffect(() => {
    dispatch(fetchBudget());
  }, [dispatch]);

  useEffect(() => {
    setNewAmount(amount);
  }, [amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setBudget(parseFloat(newAmount)));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <label>Monthly Budget: </label>
      <input
        type="number"
        value={newAmount}
        onChange={(e) => setNewAmount(e.target.value)}
      />
      <button type="submit">Save Budget</button>
    </form>
  );
}
