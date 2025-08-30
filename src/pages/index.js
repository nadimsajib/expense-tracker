import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/expenseSlice";
import { checkSession, logout } from "../../store/authSlice";
import { fetchBudget } from "../../store/budgetSlice";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseList from "../../components/ExpenseList";
import BudgetForm from "../../components/BudgetForm";
import BudgetProgress from "../../components/BudgetProgress";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import {
  CurrencyDollarIcon,
  ChartPieIcon,
  ClipboardListIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.expenses);
  const { amount: budget } = useSelector((state) => state.budget);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses());
      dispatch(fetchBudget());
    } else {
      router.push("/login");
    }
  }, [user, dispatch, router]);

  // Stats calculations
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = list.filter((exp) =>
    exp.date.startsWith(currentMonth)
  );
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = budget > 0 ? budget - totalSpent : 0;
  const expenseCount = monthlyExpenses.length;

  const topCategory = useMemo(() => {
    const categoryTotals = {};
    monthlyExpenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    });
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "N/A";
  }, [monthlyExpenses]);

  if (!user) return null;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-sm font-medium text-gray-500">Total Spent</h2>
          <p className="text-2xl font-bold text-blue-600">
            ${totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-sm font-medium text-gray-500">
            Remaining Budget
          </h2>
          <p
            className={`text-2xl font-bold ${
              remainingBudget < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-sm font-medium text-gray-500">
            Number of Expenses
          </h2>
          <p className="text-2xl font-bold text-purple-600">{expenseCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-sm font-medium text-gray-500">Top Category</h2>
          <p className="text-2xl font-bold text-orange-500">{topCategory}</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <BudgetForm />
        <BudgetProgress />
      </div>

      {/* Expense Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <ExpenseForm />
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <ExpenseList />
      </div>
    </Layout>
  );
}
