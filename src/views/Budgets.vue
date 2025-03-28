<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Budgets</h1>
      <button 
        @click="showAddBudgetModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Add Budget
      </button>
    </div>

    <!-- Budget Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="budget in budgetsWithSpent" :key="budget.category" 
           class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold">{{ budget.category }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{ budget.spent }} € / {{ budget.limit }} €</span>
            <button @click="editBudget(budget)" class="text-gray-500 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button @click="removeBudget(budget.category)" class="text-gray-500 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            class="h-2.5 rounded-full transition-all"
            :class="getBudgetColor(budget.spent / budget.limit)"
            :style="{ width: `${(budget.spent / budget.limit * 100)}%` }"
          ></div>
        </div>

        <div class="flex justify-between text-sm text-gray-600">
          <span>{{ ((budget.spent / budget.limit) * 100).toFixed(0) }}% used</span>
          <span>{{ budget.limit - budget.spent }} € remaining</span>
        </div>
      </div>
    </div>

    <!-- Total Budget Summary -->
    <div class="mt-8 bg-gray-100 p-6 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Total</h2>
        <span>{{ totalSpent }} € / {{ totalBudget }} €</span>
      </div>
    </div>

    <!-- Add Budget Modal -->
    <div v-if="showAddBudgetModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
            <input v-model.number="newBudget.limit" type="number" required min="0"
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
    <!-- Edit Budget Modal -->
    <div v-if="showEditModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Edit Budget</h2>
        <!-- In the Edit Budget Modal template -->
        <form @submit.prevent="updateBudget">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Category</label>
            <input :value="editingBudget.category" disabled
                   class="w-full border rounded-md p-2 bg-gray-100">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Monthly Limit (€)</label>
            <input v-model.number="editingBudget.limit" type="number" required min="0"
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

// Remove the local budgets ref declaration and use store's budgets

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