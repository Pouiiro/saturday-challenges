import { Card } from "@/components/ui/card";
import { useStore } from "@/stores/richie";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"; // Icons for warnings

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { incomes, currency, totalExpenses, totalInvestments, budget } =
    useStore(
      useShallow((state) => ({
        incomes: state.incomes,
        totalExpenses: state.totalExpenses,
        totalInvestments: state.totalInvestments,
        budget: state.budget,
        currency: state.currency,
      })),
    );

  const totalIncome = incomes.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpenses;
  const budgetUsage = ((totalExpenses / (budget || 0)) * 100).toFixed(1);
  const formattedTotalIncome = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(totalIncome);
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(balance);
  const formattedExpenses = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(totalExpenses);
  const formattedInvest = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(totalInvestments);

  const isNegativeBalance = balance < 0;
  const isCloseToNegative = balance >= 0 && balance < totalIncome * 0.1;

  const balanceColor = isNegativeBalance
    ? "text-red-900 dark:text-red-100"
    : isCloseToNegative
      ? "text-orange-900 dark:text-orange-100"
      : "text-green-900 dark:text-green-100";

  const balanceIcon = isNegativeBalance ? (
    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 inline-block ml-2" />
  ) : isCloseToNegative ? (
    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 inline-block ml-2" />
  ) : (
    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 inline-block ml-2" />
  );

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-h-screen w-[calc(100vw-15rem)]">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border border-green-300 shadow-sm dark:bg-green-900 dark:border-green-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">
            Available Balance
          </h2>
          <div className="flex items-center">
            <p className={`text-2xl font-bold ${balanceColor}`}>
              {formattedBalance}
            </p>
            {balanceIcon}
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border border-green-300 shadow-sm dark:bg-green-900 dark:border-green-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">
            Total Income
          </h2>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formattedTotalIncome}
          </p>
        </Card>
        <Card className="p-4 bg-red-50 border border-red-300 shadow-sm dark:bg-red-900 dark:border-red-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
            Total Expenses
          </h2>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
            {formattedExpenses}
          </p>
        </Card>
        <Card className="p-4 bg-blue-50 border border-blue-300 shadow-sm dark:bg-blue-900 dark:border-blue-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            Total Investments
          </h2>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formattedInvest}
          </p>
        </Card>

        <Card className="p-4 bg-yellow-50 border border-yellow-300 shadow-sm dark:bg-yellow-900 dark:border-yellow-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
            Budget Usage
          </h2>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {budgetUsage === "NaN" ? 0 : budgetUsage}%
          </p>
          {parseFloat(budgetUsage) >= 80 && parseFloat(budgetUsage) < 100 ? (
            <p className="mt-2 text-sm text-yellow-600 font-medium dark:text-yellow-400">
              Warning: You are close to exceeding your budget!
            </p>
          ) : null}
          {parseFloat(budgetUsage) === 100 ? (
            <p className="mt-2 text-sm text-green-600 font-medium dark:text-green-400">
              You are at your budget limit.
            </p>
          ) : null}
          {parseFloat(budgetUsage) > 100 ? (
            <p className="mt-2 text-sm text-red-600 font-medium dark:text-red-400 flex items-center gap-2">
              <XCircle size={16} /> Warning: You are beyond your monthly budget!
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
