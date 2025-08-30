import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/expenseSlice";
import { checkSession } from "../../store/authSlice";
import { useRouter } from "next/router";
import { Bar, Pie, Line } from "react-chartjs-2";
import Layout from "../../components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses());
    } else {
      router.push("/login");
    }
  }, [user, dispatch, router]);

  if (!user) return null;

  // Prepare chart data
  const monthlyData = {};
  const categoryData = {};
  const dailyData = {};

  list.forEach((exp) => {
    const month = exp.date.slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + exp.amount;

    categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;

    dailyData[exp.date] = (dailyData[exp.date] || 0) + exp.amount;
  });

  const monthlyChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(monthlyData),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryData),
        backgroundColor: [
          "#F87171",
          "#60A5FA",
          "#FBBF24",
          "#34D399",
          "#A78BFA",
          "#F97316",
        ],
      },
    ],
  };

  const dailyChartData = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        label: "Daily Spending",
        data: Object.values(dailyData),
        borderColor: "#8B5CF6",
        backgroundColor: "#C4B5FD",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
          <Bar data={monthlyChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <Pie data={categoryChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Daily Spending Trend</h2>
          <Line data={dailyChartData} />
        </div>
      </div>
    </Layout>
  );
}
