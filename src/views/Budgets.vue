<template>
  <div class="p-4 lg:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-8 gap-4">
      <div>
        <h1 class="text-xl lg:text-2xl font-bold">Budgets</h1>
        <p class="text-sm text-gray-500">Monthly spending limits for {{ formattedMonth }}</p>
      </div>
      <button 
        v-if="budgetsWithSpent.length > 0"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        @click="showAddBudgetModal = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Budget
      </button>
    </div>

    <!-- Budget Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <!-- Empty State -->
      <div v-if="budgetsWithSpent.length === 0" 
           class="col-span-full flex flex-col items-center justify-center py-12 lg:py-20">
        <div class="text-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No budgets created yet</h3>
          <p class="text-gray-500 mb-6">Start managing your finances by creating your first budget category</p>
        </div>
        <button 
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          @click="showAddBudgetModal = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Your First Budget
        </button>
      </div>
      
      <!-- Budget Cards -->
      <div v-for="budget in budgetsWithSpent" 
           v-else 
           :key="budget.category" 
           class="bg-white p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <div>
            <h3 class="font-semibold text-base lg:text-lg">{{ budget.category }}</h3>
            <p class="text-xs lg:text-sm text-gray-500">Monthly Budget</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span class="text-sm font-medium order-2 sm:order-1" 
                  :class="budget.spent > budget.budget_limit ? 'text-red-600' : 'text-gray-600'">
                {{ budget.spent.toFixed(2) }} € / {{ budget.budget_limit.toFixed(2) }} €
            </span>
            <div class="flex gap-2 order-1 sm:order-2">
              <button class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors" 
                      @click="editBudget(budget)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button class="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors" 
                      @click="removeBudget(budget.category)">
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
               :class="getBudgetColor(budget.spent / budget.budget_limit)"
               :style="{ width: `${Math.min((budget.spent / budget.budget_limit * 100), 100)}%` }">
          </div>
        </div>

        <!-- Status Display -->
        <div class="flex justify-between text-sm">
          <span class="font-medium" :class="budget.spent / budget.budget_limit > 0.75 ? 'text-yellow-600' : 'text-gray-600'">
            {{ ((budget.spent / budget.budget_limit) * 100).toFixed(1) }}% used
          </span>
          <span :class="budget.budget_limit - budget.spent > 0 ? 'text-green-600' : 'text-red-600'">
            {{ budget.budget_limit - budget.spent > 0 
              ? `${(budget.budget_limit - budget.spent).toFixed(2)} € available` 
              : `${Math.abs(budget.budget_limit - budget.spent).toFixed(2)} € over budget`
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- Total Budget Summary -->
    <div v-if="budgetsWithSpent.length > 0" class="mt-6 lg:mt-8 bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h2 class="text-lg lg:text-xl font-semibold">Total Budget Overview</h2>
          <p class="text-xs lg:text-sm text-gray-500">Monthly spending for {{ formattedMonth }}</p>
        </div>
        <span class="text-base lg:text-lg font-medium px-4 py-2 bg-gray-50 rounded-lg w-full sm:w-auto text-center">
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

    <!-- Modals -->
    <!-- Update modal padding for mobile -->
    <div v-if="showAddBudgetModal" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white p-4 lg:p-6 rounded-lg w-full max-w-sm mx-auto">
          <h2 class="text-xl font-semibold mb-4">Add New Budget</h2>
          <form @submit.prevent="addBudget">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Category</label>
              <input v-model="newBudget.category" type="text" required
                     class="w-full border rounded-md p-2">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Monthly Limit (€)</label>
              <input v-model.number="newBudget.budget_limit" type="number" required min="0.01" step="0.01"
                     class="w-full border rounded-md p-2">
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" class="text-gray-600"
                      @click="showAddBudgetModal = false">Cancel</button>
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
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-white p-4 lg:p-6 rounded-lg w-full max-w-sm mx-auto">
          <h2 class="text-xl font-semibold mb-4">Edit Budget</h2>
          <form @submit.prevent="updateBudget">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Category</label>
              <input :value="editingBudget.category" disabled
                     class="w-full border rounded-md p-2 bg-gray-100">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Monthly Limit (€)</label>
              <input v-model.number="editingBudget.budget_limit" type="number" required min="0.01" step="0.01"
                     class="w-full border rounded-md p-2">
            </div>
            <div class="flex justify-end gap-4">
              <button type="button" class="text-gray-600"
                      @click="showEditModal = false">Cancel</button>
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
// Add onMounted to check monthly reset
import { onMounted } from 'vue';

onMounted(() => {
  budgetStore.checkMonthlyReset();  
});

const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();
const { budgets, currentMonth } = storeToRefs(budgetStore);
const { transactions } = storeToRefs(transactionStore);
const showAddBudgetModal = ref(false);

const formattedMonth = computed(() => 
    new Date(currentMonth.value + '-01').toLocaleString('en-US', { month: 'long' })
  );

const newBudget = ref<Budget>({
  category: '',
  budget_limit: 0
});

const budgetsWithSpent = computed<BudgetWithSpent[]>(() => {
  if (!budgets.value || !transactions.value) return [];
  
  return budgets.value.map(budget => {
    const spent = transactions.value
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category &&
        t.date.startsWith(currentMonth.value)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spent
    };
  });
});

// Update totalBudget to use store's budgets
const totalBudget = computed(() => 
  budgets.value.reduce((sum, budget) => sum + budget.budget_limit, 0)
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
  if (!newBudget.value.budget_limit || newBudget.value.budget_limit <= 0) {
    return;
  }
  
  // Check if category already exists
  if (budgets.value.some(budget => budget.category.toLowerCase() === newBudget.value.category.toLowerCase())) {
    alert('A budget with this category already exists');
    return;
  }

  budgetStore.addBudget({
    category: newBudget.value.category,
    budget_limit: newBudget.value.budget_limit
  });
  newBudget.value = { category: '', budget_limit: 0 };
  showAddBudgetModal.value = false;
};

const showEditModal = ref(false);
const editingBudget = ref<Budget>({
  category: '',
  budget_limit: 0
});
const originalCategory = ref('');

const editBudget = (budget: BudgetWithSpent) => {
  editingBudget.value = { 
    category: budget.category,
    budget_limit: budget.budget_limit
  };
  originalCategory.value = budget.category;
  showEditModal.value = true;
};

const updateBudget = () => {
  if (!editingBudget.value.budget_limit || editingBudget.value.budget_limit <= 0) {
    return;
  }
  budgetStore.updateBudget(
    editingBudget.value.category,
    editingBudget.value.budget_limit
  );
  showEditModal.value = false;
};

const removeBudget = (category: string) => {
  if (confirm('Are you sure you want to remove this budget?')) {
    budgetStore.removeBudget(category);
  }
};
</script>