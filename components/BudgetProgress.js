import { useSelector } from "react-redux";

export default function BudgetProgress() {
  const { amount: budget } = useSelector((state) => state.budget);
  const { list } = useSelector((state) => state.expenses);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTotal = list
    .filter((exp) => exp.date.startsWith(currentMonth))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const percentage =
    budget > 0 ? Math.min((monthlyTotal / budget) * 100, 100) : 0;
  const overBudget = budget > 0 && monthlyTotal > budget;

  return (
    <div>
   <h3 className="text-lg font-semibold mb-2">Budget Progress</h3>
   <div className="w-full bg-gray-200 rounded-full h-4">
     <div
       className={`h-4 rounded-full ${overBudget ? 'bg-red-500' : 'bg-green-500'}`}
       style={{ width: `${percentage}%` }}
     ></div>
   </div>
   <p className="mt-2 text-sm">
     Spent: <span className="font-bold">TK{monthlyTotal.toFixed(2)}</span> / TK{budget.toFixed(2)}
   </p>
   {overBudget && (
     <p className="text-red-600 font-bold mt-1">⚠ You have exceeded your budget!</p>
   )}
 </div>
  );
}
