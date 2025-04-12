<template>
  <!-- Layout dinámico según la ruta actual -->
  <div :class="appWrapperClass">
    <!-- Overlay de carga global -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="text-white text-center">
        <svg class="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading your data...</p>
      </div>
    </div>

    <!-- Sidebar solo si no estás en /auth -->
    <Sidebar v-if="!isAuthRoute" />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col" :class="{ 'overflow-y-auto': !isAuthRoute }">
      <div
        v-if="!isAuthRoute"
        class="p-6 lg:p-6 flex-1"
        :class="{ 'pl-16 lg:pl-6': !isAuthRoute }"
      >
        <router-view @open-modal="showModal = true" />
      </div>

      <!-- Renderizar AuthView directamente si estás en /auth -->
      <router-view v-if="isAuthRoute" />
    </div>
  </div>

  <!-- Modal global -->
  <Modal v-if="!isAuthRoute" :isOpen="showModal" title="Añadir Transacción" @close="showModal = false" />
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue';
import { useUserStore } from './store/user';
import { useTransactionStore } from './store/transactions';
import { useBudgetStore } from './store/budgets';
import Sidebar from './components/Sidebar.vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isAuthRoute = computed(() => 
  route.path.includes('/auth') || 
  route.path.includes('/reset-password')
);

const showModal = ref(false);

const userStore = useUserStore();
const transactionStore = useTransactionStore();
const budgetStore = useBudgetStore();

const isLoading = computed(() => userStore.isLoading || transactionStore.isLoading || budgetStore.isLoading);

const appWrapperClass = computed(() => {
  return isAuthRoute.value
    ? 'w-screen h-screen overflow-hidden' // Auth ocupa todo, sin layout
    : 'flex min-h-screen w-full bg-gray-100'; // Layout general
});

onMounted(async () => {
  console.log('App mounted, initializing user...');
  await userStore.initialize();
  
  // After user is initialized, load data if user is authenticated or in guest mode
  if (userStore.user || userStore.isGuestMode) {
    console.log('Loading data for', userStore.isGuestMode ? 'guest user' : 'authenticated user');
    await Promise.all([
      transactionStore.loadTransactions(),
      budgetStore.loadBudgets()
    ]);
    console.log('Data loaded:', {
      transactions: transactionStore.transactions.length,
      budgets: budgetStore.budgets.length
    });
  }
  
  // Redirect to appropriate route if at root
  if (route.path === '/') {
    if (userStore.user || userStore.isGuestMode) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }
});

// Watch for changes in authentication state
watch(() => userStore.user, async (newUser) => {
  if (newUser || userStore.isGuestMode) {
    console.log('User state changed, reloading data');
    await Promise.all([
      transactionStore.loadTransactions(),
      budgetStore.loadBudgets()
    ]);
  }
});
</script>
