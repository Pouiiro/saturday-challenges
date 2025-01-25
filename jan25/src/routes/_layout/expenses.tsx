import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/richie";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { ExpensesTable } from "@/components/expensesTableN";
import { EditDialog } from "@/components/editExpense";

const expenseSchema = z.object({
  name: z.string().min(1, { message: "Expense name is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  category: z.string().optional().nullable(),
});

export const Route = createFileRoute("/_layout/expenses")({
  component: RouteComponent,
});

export type FormValues = z.infer<typeof expenseSchema>;

function RouteComponent() {
  const expenses = useStore((state) => state.expenses);
  const addExpense = useStore((state) => state.addExpense);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      amount: "" as unknown as number,
    },
  });

  const handleAddExpense = (data: { name: string; amount: number }) => {
    addExpense({ id: uuidv4(), ...data });
    reset();
  };

  const currency = useStore((state) => state.currency);

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-h-screen w-[calc(100vw-15rem)]">
      <div className="h-1/5 flex gap-4 flex-row justify-between">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
          Expenses
        </h1>
        <h4 className="font-bold text-blue-600 dark:text-blue-400">
          Total:{" "}
          <span className="text-yellow-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(
              expenses.reduce((sum, expense) => sum + expense.amount, 0),
            )}
          </span>
        </h4>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex-shrink-0 ">
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
            Add New Expense
          </h2>
          <form
            onSubmit={handleSubmit(handleAddExpense)}
            className="flex gap-4 py-4"
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Expense name"
                  className="p-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md"
                />
              )}
            />
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(value) =>
                    field.onChange(value.target.valueAsNumber)
                  }
                  type="number"
                  placeholder="Amount"
                  className="p-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md"
                />
              )}
            />
            <Button
              variant="secondary"
              type="submit"
              className=" dark:bg-green-800 dark:text-white"
            >
              Add Expense
            </Button>
          </form>
          {errors.name && (
            <p className="text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
          {errors.amount && (
            <p className="text-red-500 dark:text-red-400">
              {errors.amount.message}
            </p>
          )}
        </div>
        <ExpensesTable />
        <EditDialog />
      </div>
    </div>
  );
}
