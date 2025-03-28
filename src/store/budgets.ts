import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Budget {
  category: string;
  limit: number;
}

export const useBudgetStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([]);

  const addBudget = (budget: Budget) => {
    budgets.value.push(budget);
  };

  const updateBudget = (category: string, newLimit: number) => {
    const budgetIndex = budgets.value.findIndex(b => b.category === category);
    if (budgetIndex !== -1) {
      budgets.value[budgetIndex] = {
        category: category,
        limit: newLimit
      };
    }
  };

  const removeBudget = (category: string) => {
    budgets.value = budgets.value.filter(b => b.category !== category);
  };

  return {
    budgets,
    addBudget,
    updateBudget,
    removeBudget
  };
}, {
  persist: true
});