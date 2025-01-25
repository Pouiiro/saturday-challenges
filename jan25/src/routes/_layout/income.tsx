import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/richie";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { IncomeTable } from "@/components/incomesTables";
import { EditIncomeDialog } from "@/components/editIncome";

const incomeSchema = z.object({
  name: z.string().min(1, { message: "Income source name is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
});

export const Route = createFileRoute("/_layout/income")({
  component: RouteComponent,
});

export type FormValues = z.infer<typeof incomeSchema>;

function RouteComponent() {
  const incomes = useStore((state) => state.incomes); // Access the incomes list from the store
  const addIncome = useStore((state) => state.addIncome); // Access addIncome method from the store

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      name: "",
      amount: "" as unknown as number,
    },
  });

  const handleAddIncome = (data: { name: string; amount: number }) => {
    addIncome({ id: uuidv4(), ...data }); // Add the income to the store
    reset();
  };

  const currency = useStore((state) => state.currency);

  return (
    <div className="p-6 space-y-6 flex flex-col gap-4 max-h-screen w-[calc(100vw-15rem)]">
      <div className="h-1/5 flex gap-4 flex-row justify-between">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
          Incomes
        </h1>
        <h4 className="font-bold text-blue-600 dark:text-blue-400">
          Total:{" "}
          <span className="text-yellow-600">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(
              incomes.reduce((sum, expense) => sum + expense.amount, 0),
            )}
          </span>
        </h4>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex-shrink-0">
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
            Add New Income
          </h2>
          <form
            onSubmit={handleSubmit(handleAddIncome)}
            className="flex gap-4 py-4"
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Income source name"
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
              className="dark:bg-green-800 dark:text-white"
            >
              Add Income
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
        <IncomeTable />
        <EditIncomeDialog />
      </div>
    </div>
  );
}

export default RouteComponent;
