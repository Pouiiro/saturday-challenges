import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, TrendingUp, Settings } from "lucide-react";

const menuItems = [
  { label: "Dashboard", route: "/", icon: <Home size={20} /> },
  { label: "Expenses", route: "/expenses", icon: <DollarSign size={20} /> },
  { label: "Income", route: "/income", icon: <DollarSign size={20} /> },
  {
    label: "Investments",
    route: "/investments",
    icon: <TrendingUp size={20} />,
  },
  { label: "Settings", route: "/settings", icon: <Settings size={20} /> },
] as const;

export const SideMenu = () => {
  return (
    <Card className="w-60 p-4 shadow-lg bg-white border border-green-500 rounded-none h-screen dark:bg-gray-900 dark:border-gray-700">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-green-600 dark:text-green-400 flex justify-center gap-3 font-sans ">
          <img src="/logo.svg" className="w-8 h-auto" /> FRUGALIFY
        </h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.route}
            variant="ghost"
            asChild
            className="flex w-full items-center justify-start gap-3 p-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
          >
            <Link
              activeProps={{
                className: "text-orange-600 font-semibold dark:text-orange-600", // Active state with a bold green color
              }}
              inactiveProps={{
                className: "text-green-500", // Inactive state with a slightly lighter green
              }}
              to={item.route}
              className="flex items-center gap-3 text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
            >
              {item.icon}
              <span className="text-lg font-medium">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </Card>
  );
};
