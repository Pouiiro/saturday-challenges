import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category?: string;
}

interface Income {
  id: string;
  name: string;
  amount: number;
}

interface RichifyState {
  categories: string[];
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  totalInvestments: number;
  budget: number;
  expenses: Expense[];
  incomes: Income[];
  currency: string;
  darkMode: boolean;
  addExpense: (expense: Expense) => void;
  updateExpense: (updatedExpense: Expense) => void;
  removeExpense: (id: string) => void;
  addIncome: (income: Income) => void;
  updateIncome: (updatedIncome: Income) => void;
  removeIncome: (id: string) => void;
  addInvestment: (amount: number) => void;
  setCurrency: (currency: string) => void;
  toggleDarkMode: () => void;
  setBudget: (budget: number) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  updateCategory: (old: string, newCategory: string) => void;
}

type EditStore = {
  isEdit: boolean;
  setEdit: (open: boolean) => void;
  editId?: string;
  setEditId: (id: string) => void;
};

export const useStore = create<RichifyState>()(
  persist(
    (set, get) => ({
      balance: 0,
      totalExpenses: 0,
      totalIncomes: 0,
      totalInvestments: 0,
      budget: 0,
      expenses: [],
      incomes: [],
      currency: "SEK",
      darkMode: false,
      categories: [],
      addCategory: (category) =>
        set((prev) => ({ categories: [...prev.categories, category] })),
      removeCategory: (category) =>
        set((prev) => ({
          categories: prev.categories.filter((c) => c !== category),
        })),
      updateCategory: (oldCategory, newCategory) =>
        set((prev) => ({
          categories: prev.categories.map((c) =>
            c === oldCategory ? newCategory : c,
          ),
        })),
      setBudget: (budget) => set({ budget }),
      toggleDarkMode: () =>
        set((prev) => ({ ...prev, darkMode: !prev.darkMode })),
      setCurrency: (currency) => set({ currency }),
      addExpense: (expense) =>
        set((state) => {
          const updatedExpenses = [expense, ...state.expenses];
          const updatedTotalExpenses = state.totalExpenses + expense.amount;
          return {
            ...state,
            expenses: updatedExpenses,
            totalExpenses: updatedTotalExpenses,
            balance: state.balance - expense.amount,
          };
        }),
      updateExpense: (updatedExpense) =>
        set((state) => {
          const updatedExpenses = state.expenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense,
          );

          const updatedTotalExpenses = updatedExpenses.reduce(
            (sum, expense) => sum + expense.amount,
            0,
          );

          return {
            expenses: updatedExpenses,
            totalExpenses: updatedTotalExpenses,
            balance:
              state.balance +
              updatedExpense.amount -
              (state.expenses.find((exp) => exp.id === updatedExpense.id)
                ?.amount || 0),
          };
        }),
      removeExpense: (id) =>
        set((state) => {
          const updatedExpenses = state.expenses.filter(
            (expense) => expense.id !== id,
          );
          const removedExpense = state.expenses.find(
            (expense) => expense.id === id,
          );
          const updatedTotalExpenses =
            state.totalExpenses - (removedExpense?.amount || 0);
          return {
            expenses: updatedExpenses,
            totalExpenses: updatedTotalExpenses,
            balance: state.balance + (removedExpense?.amount || 0),
          };
        }),
      addIncome: (income) =>
        set((state) => {
          const updatedIncomes = [income, ...state.incomes];
          const updatedTotalIncomes = state.totalIncomes + income.amount;
          return {
            incomes: updatedIncomes,
            totalIncomes: updatedTotalIncomes,
            balance: state.balance + income.amount,
          };
        }),
      updateIncome: (updatedIncome) =>
        set((state) => {
          const updatedIncomes = state.incomes.map((income) =>
            income.id === updatedIncome.id ? updatedIncome : income,
          );

          const updatedTotalIncomes = updatedIncomes.reduce(
            (sum, income) => sum + income.amount,
            0,
          );

          return {
            incomes: updatedIncomes,
            totalIncomes: updatedTotalIncomes,
            balance:
              state.balance +
              updatedIncome.amount -
              (state.incomes.find((inc) => inc.id === updatedIncome.id)
                ?.amount || 0),
          };
        }),
      removeIncome: (id) =>
        set((state) => {
          const updatedIncomes = state.incomes.filter(
            (income) => income.id !== id,
          );
          const removedIncome = state.incomes.find(
            (income) => income.id === id,
          );
          const updatedTotalIncomes =
            state.totalIncomes - (removedIncome?.amount || 0);
          return {
            incomes: updatedIncomes,
            totalIncomes: updatedTotalIncomes,
            balance: state.balance - (removedIncome?.amount || 0),
          };
        }),
      addInvestment: (amount) =>
        set((state) => ({
          totalInvestments: state.totalInvestments + amount,
          balance: state.balance - amount,
        })),
    }),
    { name: "richifyStore" },
  ),
);

export const useEditStore = create<EditStore>((set) => ({
  isEdit: false,
  setEditId: (id) => set({ editId: id }),
  setEdit: (isEdit) =>
    set((prev) => ({
      isEdit,
      editId: isEdit === false ? undefined : prev.editId,
    })),
}));
