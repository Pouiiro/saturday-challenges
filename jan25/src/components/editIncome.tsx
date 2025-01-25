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

const incomeSchema = z.object({
  name: z.string().min(1, { message: "Income name is required" }),
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  id: z.string(),
});

type FormValues = z.infer<typeof incomeSchema>;

export const EditIncomeDialog = () => {
  const incomes = useStore((state) => state.incomes); // Change to use 'incomes' from store
  const id = useEditStore((state) => state.editId);

  const income = incomes.find((inc) => inc.id === id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    values: income,
  });

  const open = useEditStore((state) => state.isEdit);
  const setEdit = useEditStore((state) => state.setEdit);
  const updateIncome = useStore((state) => state.updateIncome); // Change to use 'updateIncome'

  const handleEditIncome = (data: FormValues) => {
    updateIncome(data); // Update the income instead of expense
    reset();
    setEdit(false);
  };

  if (!income) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => setEdit(open)}>
      <DialogContent className="dark:bg-gray-900 dark:text-white">
        <form
          onKeyDown={(k) =>
            k.key === "Enter" && isValid && isDirty
              ? handleSubmit(handleEditIncome)() // Handle income instead of expense
              : undefined
          }
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Income name"
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
                handleSubmit(handleEditIncome)(); // Handle income submit
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
