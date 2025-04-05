<template>
  <div class="p-4 lg:p-6">
    <!-- Header and Filters -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 gap-4">
      <div>
        <h1 class="text-xl lg:text-2xl font-bold">Transactions</h1>
        <p class="text-sm text-gray-500">Manage your income and expenses</p>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div v-if="availableMonths.length > 0" class="flex flex-col sm:flex-row gap-3">
          <select v-model="selectedMonth" 
                  class="border rounded-md px-3 py-2 w-full sm:w-auto">
            <option value="">All Months</option>
            <option v-for="month in availableMonths" :key="month" :value="month">
              {{ formatMonth(month) }}
            </option>
          </select>
          <select v-model="selectedCategory" 
                  class="border rounded-md px-3 py-2 w-full sm:w-auto">
            <option value="">All Categories</option>
            <option v-for="budget in budgets" :key="budget.category" :value="budget.category">
              {{ budget.category }}
            </option>
          </select>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto" 
                  @click="showAddModal = true">
            New Transaction
          </button>
        </div>
      </div>
    </div>

    <!-- Responsive Table -->
    <div class="bg-white rounded-lg shadow">
      <!-- Desktop Table (hidden on mobile) -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="transaction in filteredTransactions" 
                :key="transaction.id" 
                class="hover:bg-gray-50">
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm font-medium text-gray-900">
                {{ transaction.description }}
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500">
                {{ transaction.category }}
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-right" 
                  :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'">
                {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount.toFixed(2) }} €
              </td>
              <td class="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                <button class="text-gray-500 hover:text-blue-600 mr-3" 
                        title="Edit transaction"
                        @click="editTransaction(transaction)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button class="text-gray-500 hover:text-red-600" 
                        title="Delete transaction"
                        @click="deleteTransaction(transaction.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <!-- Mobile Card View -->
      <div class="lg:hidden divide-y divide-gray-200">
        <div v-for="transaction in filteredTransactions" 
               :key="transaction.id" 
               class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-medium text-gray-900">{{ transaction.description }}</h3>
              <p class="text-sm text-gray-500">{{ transaction.category }}</p>
            </div>
            <p :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'"
               class="font-medium">
              {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount.toFixed(2) }} €
            </p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</span>
            <div class="flex gap-3">
              <button class="text-gray-500 hover:text-blue-600" 
                      title="Edit transaction"
                      @click="editTransaction(transaction)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button class="text-gray-500 hover:text-red-600" 
                      title="Delete transaction"
                      @click="deleteTransaction(transaction.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTransactions.length === 0" class="text-center py-8 lg:py-12 px-4">
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="h-10 w-10 lg:h-12 lg:w-12 mx-auto text-blue-600 mb-3 lg:mb-4" 
           fill="none" 
           viewBox="0 0 24 24" 
           stroke="currentColor">
        <path stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <h3 class="text-base lg:text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
      <p class="text-sm text-gray-500 mb-4 lg:mb-6 max-w-sm mx-auto">
        {{ selectedMonth || selectedCategory 
           ? 'Try adjusting your filters or create a new transaction' 
           : 'Start tracking your finances by adding your first transaction' }}
      </p>
      <button class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              @click="showAddModal = true">
        Add New Transaction
      </button>
    </div>
  </div>

  <!-- Add/Edit Transaction Modal -->
  <div v-if="showAddModal" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md mx-auto">
        <div class="p-4 lg:p-6">
          <h2 class="text-lg lg:text-xl font-semibold mb-4">
            {{ editingTransaction ? 'Edit' : 'New' }} Transaction
          </h2>
          <form class="space-y-4" @submit.prevent="saveTransaction">
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <select v-model="currentTransaction.type" required
                      class="w-full border rounded-md p-2 text-sm lg:text-base">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <input v-model="currentTransaction.description" 
                     type="text" 
                     required
                     class="w-full border rounded-md p-2 text-sm lg:text-base">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Category</label>
              <select v-model="currentTransaction.category" 
                      required
                      class="w-full border rounded-md p-2 text-sm lg:text-base">
                <option value="" disabled>Select a category</option>
                <option v-for="budget in budgets" 
                        :key="budget.category" 
                        :value="budget.category">
                  {{ budget.category }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Amount</label>
              <input v-model.number="currentTransaction.amount" 
                     type="number" 
                     required 
                     min="0.01" 
                     step="0.01"
                     class="w-full border rounded-md p-2 text-sm lg:text-base">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Date</label>
              <input v-model="currentTransaction.date" 
                     type="date" 
                     required
                     :max="new Date().toISOString().split('T')[0]"
                     class="w-full border rounded-md p-2 text-sm lg:text-base">
            </div>
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
              <button type="button" 
                      class="w-full sm:w-auto px-4 py-2 text-gray-600 border rounded-md text-sm lg:text-base"
                      @click="closeModal">
                Cancel
              </button>
              <button type="submit" 
                      class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm lg:text-base">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTransactionStore } from '../store/transactions';
import { useBudgetStore } from '../store/budgets';
import { storeToRefs } from 'pinia';
import type { Transaction, TransactionType } from '../types/Transaction';

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const { transactions } = storeToRefs(transactionStore);
const { budgets } = storeToRefs(budgetStore);
const showAddModal = ref(false);

const availableMonths = computed(() => {
  const months = new Set(transactions.value.map(t => t.date.substring(0, 7)));
  return Array.from(months).sort().reverse();
});

const selectedMonth = ref('');
const selectedCategory = ref('');

const filteredTransactions = computed(() => {
  return transactions.value
    .filter(t => !selectedMonth.value || t.date.startsWith(selectedMonth.value))
    .filter(t => !selectedCategory.value || t.category === selectedCategory.value)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatMonth = (monthStr: string) => {
  const date = new Date(monthStr + '-01');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
};

const editingTransaction = ref<string | null>(null);
const currentTransaction = ref<Omit<Transaction, 'id'>>({
  type: 'expense' as TransactionType,
  description: '',
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0] // Sets default to today
});

const editTransaction = (transaction: any) => {
  editingTransaction.value = transaction.id;
  currentTransaction.value = { ...transaction };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingTransaction.value = null;
  currentTransaction.value = {
    type: 'expense',
    description: '',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };
};

const saveTransaction = () => {
  if (editingTransaction.value) {
    transactionStore.updateTransaction({
      id: editingTransaction.value,
      type: currentTransaction.value.type as TransactionType,
      description: currentTransaction.value.description,
      category: currentTransaction.value.category,
      amount: currentTransaction.value.amount,
      date: currentTransaction.value.date
    });
  } else {
    transactionStore.addTransaction({
      type: currentTransaction.value.type as TransactionType,
      description: currentTransaction.value.description,
      category: currentTransaction.value.category,
      amount: currentTransaction.value.amount,
      date: currentTransaction.value.date
    });
  }
  
  closeModal();
};

const deleteTransaction = (id: string) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactionStore.removeTransaction(id);
  }
};
</script>