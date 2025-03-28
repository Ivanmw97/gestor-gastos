<template>
  <div class="container mx-auto p-6">
    <!-- Financial Summary Cards -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-600">Spent Today</h3>
        <p class="text-2xl font-bold">
          {{ spentToday }} € 
          <span v-if="Number(spentToday) > 0" :class="spentMoreThanYesterday ? 'text-red-500' : 'text-green-500'">
            {{ spentMoreThanYesterday ? '↑' : '↓' }}
          </span>
        </p>
        <p class="text-sm text-gray-600">Activity on {{ today }}</p>
        <p class="text-sm text-gray-600">
          <template v-if="Number(spentToday) > 0">
            That's {{ compareYesterday }} € {{ spentMoreThanYesterday ? 'more' : 'less' }} than yesterday
          </template>
          <template v-else>
            You have not spent anything today yet
          </template>
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-600">Spent This Month</h3>
        <p class="text-2xl font-bold">{{ spentThisMonth }} €</p>
        <p class="text-sm text-gray-600">Activity for {{ currentMonth }}</p>
        <p class="text-sm text-gray-600">That's {{ monthlyPercentage }}% of your total budget</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm text-gray-600">Budget Remaining</h3>
        <p class="text-2xl font-bold">{{ budgetRemaining }} €</p>
        <p class="text-sm text-gray-600">For {{ currentMonth }}</p>
        <p class="text-sm text-gray-600">{{ budgetStatus }}</p>
      </div>
    </div>

    <!-- Category Spending -->
    <div class="space-y-4">
      <div v-for="category in categoriesWithTransactions" :key="category.name" 
           class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-2">
          <div>
            <h3 class="font-semibold">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ Number(category.spent).toFixed(2) }} € / {{ category.budget }} €</p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div class="h-2 rounded-full transition-all"
               :class="getBudgetColor(Number(category.spent) / category.budget)"
               :style="{ width: `${Math.min((Number(category.spent) / category.budget) * 100, 100)}%` }">
          </div>
        </div>

        <!-- Transactions List -->
        <div class="space-y-2">
          <div v-for="transaction in category.transactions" :key="transaction.id"
               class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-2">
              <span>{{ formatDate(transaction.date) }}</span>
              <span>—</span>
              <span>{{ transaction.description }}</span>
            </div>
            <span class="text-red-500">-{{ Number(transaction.amount).toFixed(2) }} €</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTransactionStore } from '../store/transactions';
import { useBudgetStore } from '../store/budgets';
import { storeToRefs } from 'pinia';

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const { transactions } = storeToRefs(transactionStore);
const { budgets } = storeToRefs(budgetStore);

const today = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
});

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const spentToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const amount = transactions.value
    .filter(t => t.type === 'expense' && t.date.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0);
  return Number(amount).toFixed(2);
});

const compareYesterday = computed(() => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdaySpent = transactions.value
    .filter(t => t.type === 'expense' && t.date.startsWith(yesterdayStr))
    .reduce((sum, t) => sum + t.amount, 0);

  return Math.abs(yesterdaySpent - Number(spentToday.value)).toFixed(2);
});

const spentThisMonth = computed(() => {
  const currentMonth = new Date().getMonth();
  const amount = transactions.value
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  return Number(amount).toFixed(2);
});

const totalBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.limit, 0);
});

const categoriesWithTransactions = computed(() => {
  const transactionCategories = new Set(
    transactions.value.map(t => t.category)
  );

  const allCategories = new Set([
    ...budgets.value.map(b => b.category),
    ...transactionCategories
  ]);

  return Array.from(allCategories).map(name => {
    const budget = budgets.value.find(b => b.category === name)?.limit || 0;
    const categoryTransactions = transactions.value
      .filter(t => t.category === name && t.type === 'expense')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const spent = categoryTransactions
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      name,
      budget,
      spent,
      transactions: categoryTransactions
    };
  });
});

const monthlyPercentage = computed(() => {
  return Math.round((Number(spentThisMonth.value) / totalBudget.value) * 100);
});

const budgetRemaining = computed(() => {
  return (totalBudget.value - Number(spentThisMonth.value)).toFixed(2);
});

const budgetStatus = computed(() => {
  return Number(budgetRemaining.value) < 0 
    ? "You've exceeded your budget this month"
    : "You are within budget";
});

const getBudgetColor = (percentage: number) => {
  const ratio = Number(percentage);
  if (ratio >= 1) return 'bg-red-500';
  if (ratio >= 0.75) return 'bg-yellow-500';
  return 'bg-blue-500';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Add this computed property in the script section
const spentMoreThanYesterday = computed(() => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdaySpent = transactions.value
    .filter(t => t.type === 'expense' && t.date.startsWith(yesterdayStr))
    .reduce((sum, t) => sum + t.amount, 0);

  return Number(spentToday.value) > yesterdaySpent;
});
</script>