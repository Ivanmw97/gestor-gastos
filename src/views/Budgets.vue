<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Budgets</h1>
        <p class="text-sm text-gray-500">Manage your monthly spending limits</p>
      </div>
      <button 
        v-if="budgetsWithSpent.length > 0"
        @click="showAddBudgetModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Budget
      </button>
    </div>

    <!-- Budget Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="budgetsWithSpent.length === 0" class="col-span-full flex flex-col items-center justify-center py-20">
        <div class="text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No budgets created yet</h3>
          <p class="text-gray-500 mb-6">Start managing your finances by creating your first budget category</p>
        </div>
        <button 
          @click="showAddBudgetModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Your First Budget
        </button>
      </div>
      
      <div v-else v-for="budget in budgetsWithSpent" :key="budget.category" 
           class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="font-semibold text-lg">{{ budget.category }}</h3>
            <p class="text-sm text-gray-500">Monthly Budget</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium" 
                  :class="budget.spent > budget.limit ? 'text-red-600' : 'text-gray-600'">
              {{ budget.spent.toFixed(2) }} € / {{ budget.limit.toFixed(2) }} €
            </span>
            <div class="flex gap-2">
              <button @click="editBudget(budget)" 
                      class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button @click="removeBudget(budget.category)" 
                      class="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-100 rounded-full h-3 mb-4">
          <div class="h-3 rounded-full transition-all duration-300"
               :class="getBudgetColor(budget.spent / budget.limit)"
               :style="{ width: `${Math.min((budget.spent / budget.limit * 100), 100)}%` }">
          </div>
        </div>

        <!-- Status Display -->
        <div class="flex justify-between text-sm">
          <span class="font-medium" :class="budget.spent / budget.limit > 0.75 ? 'text-yellow-600' : 'text-gray-600'">
            {{ ((budget.spent / budget.limit) * 100).toFixed(1) }}% used
          </span>
          <span :class="budget.limit - budget.spent > 0 ? 'text-green-600' : 'text-red-600'">
            {{ budget.limit - budget.spent > 0 
              ? `${(budget.limit - budget.spent).toFixed(2)} € available` 
              : `${Math.abs(budget.limit - budget.spent).toFixed(2)} € over budget`
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Total Budget Summary -->
    <div v-if="budgetsWithSpent.length > 0" class="mt-8 bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-xl font-semibold">Total Budget Overview</h2>
          <p class="text-sm text-gray-500">All categories combined</p>
        </div>
        <span class="text-lg font-medium px-4 py-2 bg-gray-50 rounded-lg">
          {{ totalSpent.toFixed(2) }} € / {{ totalBudget.toFixed(2) }} €
        </span>
      </div>
      
      <template v-if="budgetsWithSpent.length > 0">
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-3 mt-4 mb-4">
          <div 
            class="h-3 rounded-full transition-all"
            :class="getBudgetColor(totalSpent / totalBudget)"
            :style="{ width: `${Math.min((totalSpent / totalBudget * 100), 100)}%` }"
          ></div>
        </div>

        <!-- Total Budget Status -->
        <div class="flex justify-between text-sm text-gray-600">
          <span>{{ ((totalSpent / totalBudget) * 100).toFixed(1) }}% of total budget used</span>
          <span>
            {{ totalBudget - totalSpent > 0 
              ? `${(totalBudget - totalSpent).toFixed(2)} € available` 
              : `${Math.abs(totalBudget - totalSpent).toFixed(2)} € over total budget`
            }}
          </span>
        </div>
      </template>
    </div>

    <!-- Add Budget Modal -->
    <div v-if="showAddBudgetModal" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center" 
           :style="{ paddingTop: 'calc(64px + 5vh)', paddingBottom: '30vh', paddingLeft: '240px', paddingRight: '24px' }">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Add New Budget</h2>
          <form @submit.prevent="addBudget">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Category</label>
              <input v-model="newBudget.category" type="text" required
                     class="w-full border rounded-md p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Monthly Limit (€)</label>
              <input v-model.number="newBudget.limit" type="number" required min="0.01" step="0.01"
                     class="w-full border rounded-md p-2">
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" @click="showAddBudgetModal = false"
                      class="text-gray-600">Cancel</button>
              <button type="submit" 
                      class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Budget Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center"
           :style="{ paddingTop: 'calc(64px + 5vh)', paddingBottom: '30vh', paddingLeft: '240px', paddingRight: '24px' }">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Edit Budget</h2>
          <form @submit.prevent="updateBudget">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Category</label>
              <input :value="editingBudget.category" disabled
                     class="w-full border rounded-md p-2 bg-gray-100">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Monthly Limit (€)</label>
              <input v-model.number="editingBudget.limit" type="number" required min="0.01" step="0.01"
                     class="w-full border rounded-md p-2">
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" @click="showEditModal = false"
                      class="text-gray-600">Cancel</button>
              <button type="submit" 
                      class="bg-blue-600 text-white px-4 py-2 rounded-md">Update</button>
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
import type { Budget, BudgetWithSpent } from '../types/Budget';

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);
const showAddBudgetModal = ref(false);

const newBudget = ref<Budget>({
  category: '',
  limit: 0
});

const budgetsWithSpent = computed<BudgetWithSpent[]>(() => {
  return budgets.value.map(budget => {
    const spent = transactionStore.transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent
    };
  });
});

// Update totalBudget to use store's budgets
const totalBudget = computed(() => 
  budgets.value.reduce((sum, budget) => sum + budget.limit, 0)
);

const totalSpent = computed(() => 
  budgetsWithSpent.value.reduce((sum, budget) => sum + budget.spent, 0)
);

const getBudgetColor = (percentage: number) => {
  if (percentage >= 1) return 'bg-red-500';
  if (percentage >= 0.75) return 'bg-yellow-500';
  return 'bg-blue-500';
};

const addBudget = () => {
  if (!newBudget.value.limit || newBudget.value.limit <= 0) {
    return;
  }
  
  // Check if category already exists
  if (budgets.value.some(budget => budget.category.toLowerCase() === newBudget.value.category.toLowerCase())) {
    alert('A budget with this category already exists');
    return;
  }

  budgetStore.addBudget({
    category: newBudget.value.category,
    limit: newBudget.value.limit
  });
  newBudget.value = { category: '', limit: 0 };
  showAddBudgetModal.value = false;
};

const showEditModal = ref(false);
const editingBudget = ref<Budget>({
  category: '',
  limit: 0
});
const originalCategory = ref('');

const editBudget = (budget: BudgetWithSpent) => {
  editingBudget.value = { 
    category: budget.category,
    limit: budget.limit
  };
  originalCategory.value = budget.category;
  showEditModal.value = true;
};

const updateBudget = () => {
  if (!editingBudget.value.limit || editingBudget.value.limit <= 0) {
    return;
  }
  budgetStore.updateBudget(
    editingBudget.value.category,
    editingBudget.value.limit
  );
  showEditModal.value = false;
};

const removeBudget = (category: string) => {
  if (confirm('Are you sure you want to remove this budget?')) {
    budgetStore.removeBudget(category);
  }
};
</script>