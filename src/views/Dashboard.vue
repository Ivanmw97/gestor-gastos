<template>
  <div class="p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="text-xl lg:text-2xl font-bold">Dashboard</h1>
      <p class="text-xs lg:text-sm text-gray-500">Real-time overview of your financial activity</p>
      <p class="text-xs text-blue-600 mt-2">All budget and spending data resets at the beginning of each month</p>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <!-- Today's Spending -->
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
          <h3 class="text-sm text-gray-500">Spent Today</h3>
          <span class="text-xs text-gray-400 mt-1 sm:mt-0">Updates in real-time</span>
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
        <p v-if="totalBudget > 0" class="text-xs text-gray-600">
          That's {{ ((monthlySpent / totalBudget) * 100).toFixed(1) }}% of your total budget
        </p>
        <p v-else class="text-xs text-gray-500">
          Set up a budget to track your spending
        </p>
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
        <p v-if="totalBudget > 0" class="text-xs" :class="totalBudget - monthlySpent > 0 ? 'text-green-500' : 'text-red-500'">
          {{ totalBudget - monthlySpent > 0 ? 'You are within budget' : 'You are over budget' }}
        </p>
        <p v-else class="text-xs text-gray-500">
          No budget limits set
        </p>
      </div>
    </div>

    <!-- Budget Overview -->
    <div class="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6 lg:mb-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div class="mb-2 sm:mb-0">
          <h2 class="text-base lg:text-lg font-semibold">Budget Overview</h2>
          <p class="text-xs lg:text-sm text-gray-500">Monthly progress by category</p>
        </div>
      </div>
      
      <div v-if="budgetsWithSpent.length > 0" class="space-y-4 lg:space-y-6">
        <div v-for="budget in budgetsWithSpent" 
             :key="budget.category" 
             class="space-y-2">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span class="font-medium text-sm lg:text-base">{{ budget.category }}</span>
            <span class="text-xs lg:text-sm">{{ budget.spent.toFixed(2) }} € / {{ budget.limit.toFixed(2) }} €</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="h-2 rounded-full transition-all duration-300"
                 :class="getBudgetColor(budget.spent / budget.limit)"
                 :style="{ width: `${Math.min((budget.spent / budget.limit * 100), 100)}%` }">
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-600 font-medium mb-2">No budgets set up yet</p>
        <p class="text-gray-500 text-sm mb-4">Create budgets to track spending by category</p>
        <router-link to="/budgets" 
                     class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Set Up Budget
        </router-link>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div v-if="recentTransactions.length > 0" class="bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div class="mb-2 sm:mb-0">
          <h2 class="text-base lg:text-lg font-semibold">Recent Transactions</h2>
          <p class="text-xs lg:text-sm text-gray-500">Your latest 5 transactions</p>
        </div>
        <router-link to="/transactions" 
                     class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </router-link>
      </div>

      <div class="space-y-3 lg:space-y-4">
        <div v-for="transaction in recentTransactions" 
             :key="transaction.id"
             class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="mb-2 sm:mb-0">
            <p class="font-medium text-sm lg:text-base">{{ transaction.description }}</p>
            <p class="text-xs lg:text-sm text-gray-500">{{ transaction.category }}</p>
          </div>
          <div class="text-left sm:text-right">
            <p :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'"
               class="text-sm lg:text-base">
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