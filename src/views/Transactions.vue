<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">
          Transactions
        </h1>
        <p class="text-sm text-gray-500">Manage your income and expenses</p>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="availableMonths.length > 0" class="flex gap-4">
          <select v-model="selectedMonth" 
                  class="border rounded-md px-3 py-2">
            <option value="">All Months</option>
            <option v-for="month in availableMonths" :key="month" :value="month">
              {{ formatMonth(month) }}
            </option>
          </select>
          <select v-model="selectedCategory" 
                  class="border rounded-md px-3 py-2">
            <option value="">All Categories</option>
            <option v-for="budget in budgets" 
                    :key="budget.category" 
                    :value="budget.category">
              {{ budget.category }}
            </option>
          </select>
        </div>
        <button @click="showAddModal = true" 
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Transaction
        </button>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
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
          <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ transaction.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ transaction.category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right" 
                :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'">
              {{ transaction.type === 'expense' ? '-' : '+' }}{{ transaction.amount.toFixed(2) }} €
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editTransaction(transaction)" 
                      class="text-gray-500 hover:text-blue-600 mr-3"
                      title="Edit transaction">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button @click="deleteTransaction(transaction.id)" 
                      class="text-gray-500 hover:text-red-600"
                      title="Delete transaction">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTransactions.length === 0" class="text-center py-12">
      <p class="text-gray-500">No transactions found.</p>
    </div>
  </div>

  <!-- Add/Edit Transaction Modal -->
  <div v-if="showAddModal" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    <div class="absolute inset-0 flex items-center justify-center" 
         :style="{ paddingTop: 'calc(64px + 5vh)', paddingBottom: '30vh', paddingLeft: '240px', paddingRight: '24px' }">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">{{ editingTransaction ? 'Edit' : 'New' }} Transaction</h2>
        <form @submit.prevent="saveTransaction">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Type</label>
            <select v-model="currentTransaction.type" required
                    class="w-full border rounded-md p-2">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Description</label>
            <input v-model="currentTransaction.description" type="text" required
                   class="w-full border rounded-md p-2">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Category</label>
            <select v-model="currentTransaction.category" required
                    class="w-full border rounded-md p-2">
              <option value="" disabled>Select a category</option>
              <option v-for="budget in budgets" 
                      :key="budget.category" 
                      :value="budget.category">
                {{ budget.category }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Amount</label>
            <input v-model.number="currentTransaction.amount" type="number" required min="0.01" step="0.01"
                   class="w-full border rounded-md p-2">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Date</label>
            <input v-model="currentTransaction.date" 
                   type="date" 
                   required
                   :max="new Date().toISOString().split('T')[0]"
                   class="w-full border rounded-md p-2">
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="closeModal"
                    class="text-gray-600">Cancel</button>
            <button type="submit" 
                    class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
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
    day: 'numeric'
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
      id: crypto.randomUUID(),
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