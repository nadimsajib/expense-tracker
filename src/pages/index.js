import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/expenseSlice";
import { checkSession, logout } from "../../store/authSlice";
import { fetchBudget } from "../../store/budgetSlice";
import { fetchBalance } from "../../store/balanceSlice";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseList from "../../components/ExpenseList";
import BudgetForm from "../../components/BudgetForm";
import BudgetProgress from "../../components/BudgetProgress";
import AddFundsForm from "../../components/AddFundsForm";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.expenses);
  const { amount: budget } = useSelector((state) => state.budget);
  const { cash_in_hand, cash_in_bank } = useSelector((state) => state.balance);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses());
      dispatch(fetchBudget());
      dispatch(fetchBalance({ month: currentMonth })); // <-- Fetch balance for current month
    } else {
      router.push("/login");
    }
  }, [user, dispatch, router, currentMonth]);

  // Stats calculations
  //const currentMonth = new Date().toISOString().slice(0, 7);
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

  const statCards = [
    {
      title: "Total Spent",
      value: `৳${totalSpent.toFixed(2)}`,
      color: "text-blue-600",
    },
    {
      title: "Remaining Budget",
      value: `৳${remainingBudget.toFixed(2)}`,
      color: remainingBudget < 0 ? "text-red-600" : "text-green-600",
    },
    {
      title: "Number of Expenses",
      value: expenseCount,
      color: "text-purple-600",
    },
    { title: "Top Category", value: topCategory, color: "text-orange-500" },
    {
      title: "Cash in Hand",
      value: `৳${cash_in_hand?.toFixed(2) || 0}`,
      color: "text-yellow-600",
    },
    {
      title: "Cash in Bank",
      value: `৳${cash_in_bank?.toFixed(2) || 0}`,
      color: "text-green-600",
    },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-sm font-medium text-gray-500">{card.title}</h2>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Add Funds */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Funds</h2>
        <AddFundsForm />
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
