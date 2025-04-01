<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-gray-500">Real-time overview of your financial activity</p>
      <p class="text-xs text-blue-600 mt-2">All budget and spending data resets at the beginning of each month</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Today's Spending -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm text-gray-500">Spent Today</h3>
          <span class="text-xs text-gray-400">Updates in real-time</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold">{{ todaySpent.toFixed(2) }} €</span>
          <span v-if="spentDifference !== 0" 
                class="text-sm" 
                :class="spentDifference > 0 ? 'text-red-500' : 'text-green-500'">
            {{ spentDifference > 0 ? '↑' : '↓' }} {{ Math.abs(spentDifference).toFixed(2) }} €
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-2">Activity on {{ formatDate(new Date()) }}</p>
        <p v-if="spentDifference !== 0" 
           class="text-xs" 
           :class="spentDifference > 0 ? 'text-red-500' : 'text-green-500'">
          That's {{ Math.abs(spentDifference).toFixed(2) }} € {{ spentDifference > 0 ? 'more' : 'less' }} than yesterday
        </p>
      </div>

      <!-- Monthly Spending -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm text-gray-500">Spent This Month</h3>
          <span class="text-xs text-gray-400">Current month only</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold">{{ monthlySpent.toFixed(2) }} €</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">Activity for {{ formatMonth(new Date()) }}</p>
        <p class="text-xs text-gray-600">That's {{ ((monthlySpent / totalBudget) * 100).toFixed(1) }}% of your total budget</p>
      </div>

      <!-- Budget Remaining -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm text-gray-500">Budget Remaining</h3>
          <span class="text-xs text-gray-400">Resets monthly</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold">{{ (totalBudget - monthlySpent).toFixed(2) }} €</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">For {{ formatMonth(new Date()) }}</p>
        <p class="text-xs" :class="totalBudget - monthlySpent > 0 ? 'text-green-500' : 'text-red-500'">
          {{ totalBudget - monthlySpent > 0 ? 'You are within budget' : 'You are over budget' }}
        </p>
      </div>
    </div>

    <!-- Budget Overview -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-lg font-semibold">Budget Overview</h2>
          <p class="text-sm text-gray-500">Monthly progress by category</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <div v-for="budget in budgetsWithSpent" :key="budget.category" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-medium">{{ budget.category }}</span>
            <span class="text-sm">{{ budget.spent.toFixed(2) }} € / {{ budget.limit.toFixed(2) }} €</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="h-2 rounded-full transition-all duration-300"
                 :class="getBudgetColor(budget.spent / budget.limit)"
                 :style="{ width: `${Math.min((budget.spent / budget.limit * 100), 100)}%` }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-lg font-semibold">Recent Transactions</h2>
          <p class="text-sm text-gray-500">Your latest 5 transactions</p>
        </div>
        <router-link to="/transactions" 
                     class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </router-link>
      </div>

      <div class="space-y-4">
        <div v-for="transaction in recentTransactions" :key="transaction.id"
             class="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div>
            <p class="font-medium">{{ transaction.description }}</p>
            <p class="text-sm text-gray-500">{{ transaction.category }}</p>
          </div>
          <div class="text-right">
            <p :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'">
              {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount.toFixed(2) }} €
            </p>
            <p class="text-xs text-gray-500">{{ formatDate(new Date(transaction.date)) }}</p>
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

const currentMonth = new Date().toISOString().substring(0, 7);

// Update computed properties to only use current month data
const currentMonthTransactions = computed(() => 
  transactions.value.filter(t => t.date.startsWith(currentMonth))
);

const todaySpent = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return currentMonthTransactions.value
    .filter(t => t.type === 'expense' && t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);
});

const monthlySpent = computed(() => {
  return currentMonthTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const budgetsWithSpent = computed(() => {
  return budgets.value.map(budget => {
    const spent = currentMonthTransactions.value
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent
    };
  });
});

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const spentDifference = computed(() => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdaySpent = currentMonthTransactions.value
    .filter(t => t.type === 'expense' && t.date.startsWith(yesterdayStr))
    .reduce((sum, t) => sum + t.amount, 0);

  return todaySpent.value - yesterdaySpent;
});

const totalBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.limit, 0);
});

const getBudgetColor = (percentage: number) => {
  const ratio = Number(percentage);
  if (ratio >= 1) return 'bg-red-500';
  if (ratio >= 0.75) return 'bg-yellow-500';
  return 'bg-blue-500';
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const formatMonth = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};
</script>