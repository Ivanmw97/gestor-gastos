<template>
  <div class="p-4 lg:p-6">
    <!-- Header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="text-xl lg:text-2xl font-bold">Statistics</h1>
      <p class="text-sm text-gray-500">Financial insights and analysis</p>
    </div>

    <!-- Time Period Selector -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <select v-model="selectedYear" 
              class="border rounded-md px-3 py-2 w-full sm:w-auto">
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>

      <select v-model="selectedMonth" 
              class="border rounded-md px-3 py-2 w-full sm:w-auto">
        <option value="all">All Months</option>
        <option v-for="month in 12" :key="month" :value="month.toString().padStart(2, '0')">
          {{ new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }) }}
        </option>
      </select>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-xs lg:text-sm text-gray-500 mb-2">Total Income</h3>
        <p class="text-xl lg:text-2xl font-bold text-green-600">{{ totalIncome.toFixed(2) }} €</p>
      </div>
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-xs lg:text-sm text-gray-500 mb-2">Total Expenses</h3>
        <p class="text-xl lg:text-2xl font-bold text-red-600">{{ totalExpenses.toFixed(2) }} €</p>
      </div>
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-xs lg:text-sm text-gray-500 mb-2">Net Savings</h3>
        <p class="text-xl lg:text-2xl font-bold" :class="netSavings >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ netSavings.toFixed(2) }} €
        </p>
      </div>
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-xs lg:text-sm text-gray-500 mb-2">Most Spent Category</h3>
        <p class="text-xl lg:text-2xl font-bold text-blue-600">{{ mostSpentCategory }}</p>
      </div>
    </div>

    <!-- Category Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-base lg:text-lg font-semibold mb-4">Expense by Category</h3>
        <div class="space-y-3 lg:space-y-4">
          <div v-for="category in categoryExpenses" 
               :key="category.name" 
               class="flex items-center gap-3 lg:gap-4">
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="text-xs lg:text-sm font-medium">{{ category.name }}</span>
                <span class="text-xs lg:text-sm text-gray-500">{{ category.percentage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="h-2 rounded-full bg-blue-500 transition-all duration-300"
                     :style="{ width: `${category.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <h3 class="text-base lg:text-lg font-semibold mb-4">Daily Spending Trend</h3>
        <div class="h-48 lg:h-64 flex flex-col items-center justify-center">
          <!-- Chart placeholder -->
          <div class="w-full flex items-end justify-between space-x-1 px-4 mb-4">
            <div v-for="i in 12" :key="i" 
                 class="bg-blue-400 opacity-60 rounded-t-md transition-all duration-300 hover:opacity-100"
                 :class="i % 3 === 0 ? 'bg-blue-600' : ''"
                 :style="`height: ${20 + Math.random() * 60}px; width: ${100/14}%`">
            </div>
          </div>
          <div class="flex items-center mt-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p class="text-sm">Interactive chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTransactionStore } from '../store/transactions';
import { storeToRefs } from 'pinia';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 8; i++) {
    years.push((currentYear - i).toString());
  }
  return years;
});

// Initialize selectedYear with current year
const selectedYear = ref(new Date().getFullYear().toString());
const selectedMonth = ref('all');

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const transactionYear = t.date.substring(0, 4);
    const transactionMonth = t.date.substring(5, 7);
    
    if (selectedMonth.value === 'all') {
      return transactionYear === selectedYear.value;
    }
    
    return transactionYear === selectedYear.value && 
            transactionMonth === selectedMonth.value;
  });
});

const totalIncome = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
);

const totalExpenses = computed(() => 
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
);

const netSavings = computed(() => 
  totalIncome.value - totalExpenses.value
);

const categoryExpenses = computed(() => {
  const expenses = filteredTransactions.value.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: (amount / total) * 100
    }))
    .sort((a, b) => b.amount - a.amount);
});

const mostSpentCategory = computed(() => 
  categoryExpenses.value[0]?.name || 'No expenses'
);
</script>
