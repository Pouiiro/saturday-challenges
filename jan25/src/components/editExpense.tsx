import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditStore, useStore } from "@/stores/richie";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle, CheckCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const expenseSchema = z.object({
  name: z.string().min(1, { message: "Expense name is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  id: z.string(),
});

type FormValues = z.infer<typeof expenseSchema>;

export const EditDialog = () => {
  const expenses = useStore((state) => state.expenses);
  const id = useEditStore((state) => state.editId);

  const expense = expenses.find((exp) => exp.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(expenseSchema),
    values: expense,
  });

  const open = useEditStore((state) => state.isEdit);
  const setEdit = useEditStore((state) => state.setEdit);
  const updateExpense = useStore((state) => state.updateExpense);

  const handleEditExpense = (data: FormValues) => {
    updateExpense(data);
    reset();
    setEdit(false);
  };

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => setEdit(open)}>
      <DialogContent className="dark:bg-gray-900 dark:text-white">
        <form
          onKeyDown={(k) =>
            k.key === "Enter" && isValid && isDirty
              ? handleSubmit(handleEditExpense)()
              : undefined
          }
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
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
                type="number"
                onChange={(value) => field.onChange(value.target.valueAsNumber)}
                placeholder="Amount"
                className="p-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md"
              />
            )}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEdit(false)}
              className="text-gray-500 dark:text-gray-400 flex items-center gap-2"
            >
              <XCircle size={16} /> Cancel
            </Button>
            <Button
              disabled={!isDirty || !isValid}
              variant="outline"
              type="button"
              onClick={() => {
                handleSubmit(handleEditExpense)();
              }}
              className="text-green-500 dark:text-green-400 flex items-center gap-2"
            >
              <CheckCircle size={16} /> Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
