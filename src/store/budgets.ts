import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Budget {
  category: string;
  limit: number;
}

export const useBudgetStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([]);
  const currentMonth = ref(new Date().toISOString().substring(0, 7));
  const lastResetMonth = ref(localStorage.getItem('lastResetMonth') || '');

  const checkMonthlyReset = () => {
    const thisMonth = new Date().toISOString().substring(0, 7);
    if (lastResetMonth.value !== thisMonth) {
      currentMonth.value = thisMonth;
      lastResetMonth.value = thisMonth;
      localStorage.setItem('lastResetMonth', thisMonth);
    }
  };

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
    currentMonth,
    lastResetMonth,
    checkMonthlyReset,
    addBudget,
    updateBudget,
    removeBudget
  };
}, {
  persist: true
});