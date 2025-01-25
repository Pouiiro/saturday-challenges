import { useStore } from "@/stores/richie";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";
import { Card } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Fetching currencies
const fetchCurrencies = async () => {
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch currencies");
  }
  return response.json();
};

const categorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required" }),
});

type FormValues = z.infer<typeof categorySchema>;

export const Route = createFileRoute("/_layout/settings")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryFn: fetchCurrencies,
      queryKey: ["currencies"],
    });
  },
  pendingComponent: () => <div>loading...</div>,
  errorComponent: () => <div>error</div>,
});

function RouteComponent() {
  const { currency, budget, categories } = useStore(
    useShallow((state) => ({
      currency: state.currency,
      darkMode: state.darkMode,
      categories: state.categories,
      budget: state.budget,
    })),
  );
  const setBudget = useStore((state) => state.setBudget);
  const addCategory = useStore((state) => state.addCategory);
  const removeCategory = useStore((state) => state.removeCategory);
  const setCurrency = useStore((state) => state.setCurrency);

  const { data } = useSuspenseQuery<Record<PropertyKey, string>>({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
  });

  const currencies = Object.keys(data).map((currency) =>
    currency.toUpperCase(),
  );

  const refinedSchema = categorySchema.superRefine((val, ctx) => {
    if (categories.includes(val.categoryName)) {
      ctx.addIssue({
        path: ["categoryName"],
        message: "Category already exists!",
        code: "custom",
      });
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(refinedSchema),
    mode: "onChange",
    defaultValues: {
      categoryName: "",
    },
  });

  const onSubmit = (data: { categoryName: string }) => {
    addCategory(data.categoryName);
    reset();
  };

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-h-screen w-[calc(100vw-15rem)]">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
        Settings
      </h1>

      <div className="flex flex-wrap gap-5 justify-between items-center ">
        <Card className="p-4 bg-white border border-green-300 shadow-sm dark:bg-gray-800 dark:border-green-500 w-6/12 h-30">
          <h2 className="text-lg font-semibold text-green-700 mb-4 dark:text-green-400">
            Select Default Currency
          </h2>
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value)}
          >
            <SelectTrigger className="w-64 border-green-500 dark:border-green-400">
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4 bg-white border border-green-300 shadow-sm dark:bg-gray-800 dark:border-green-500 flex-1 h-30">
          <h2 className="text-lg font-semibold text-green-700 mb-4 dark:text-green-400">
            Set Monthly Budget
          </h2>
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.currentTarget.value))}
            className="w-full p-2 border border-green-500 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-green-400 focus:outline-none focus:ring focus:ring-green-30"
            placeholder="Enter your monthly budget"
          />
        </Card>

        <Card className="p-4 bg-white border border-green-300 shadow-sm dark:bg-gray-800 dark:border-green-500 w-full gap-4 flex flex-col">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
            Expense Categories
          </h2>
          <div className="space-x-4 flex flex-wrap justify-start items-center">
            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-green-100 text-green-700 rounded-full py-1 px-4 flex items-center space-x-2 mb-2"
              >
                <span>{category}</span>
                <motion.button
                  onClick={() => removeCategory(category)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-green-500 hover:text-green-700"
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
          <motion.div
            transition={{ delay: 0.5, duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
              <Input
                {...register("categoryName")}
                type="text"
                placeholder="Add new category"
                className="p-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md w-full"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-green-600 text-white rounded-full p-2.5"
              >
                <Plus size={16} />
              </motion.button>
            </form>
          </motion.div>

          {errors.categoryName && (
            <p className="text-red-500 text-sm mt-2">
              {errors.categoryName.message}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
