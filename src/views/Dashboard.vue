<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Resumen Financiero</h1>

    <!-- Sección de tarjetas de balance -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 class="text-xl font-semibold">Balance Total</h2>
        <p class="text-3xl font-bold mt-2">{{ (balance ?? 0).toLocaleString() }} €</p>
      </div>

      <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 class="text-xl font-semibold">Ingresos</h2>
        <p class="text-3xl font-bold mt-2">{{ (totalIncome ?? 0).toLocaleString() }} €</p>
      </div>

      <div class="bg-red-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 class="text-xl font-semibold">Gastos</h2>
        <p class="text-3xl font-bold mt-2">{{ (totalExpense ?? 0).toLocaleString() }} €</p>
      </div>
    </div>

    <!-- Botón para añadir nueva transacción -->
    <div class="mt-8 text-center">
      <button
        @click="modalStore.openModal()"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        + Añadir Transacción
      </button>
    </div>

    <!-- Lista de transacciones recientes -->
    <div class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">Transacciones Recientes</h2>
      <ul v-if="recentTransactions.length > 0" class="bg-white shadow-md rounded-lg divide-y">
        <li v-for="transaction in recentTransactions" :key="transaction.id" class="p-4 flex justify-between">
          <span class="font-medium">{{ transaction.category }}</span>
          <span :class="transaction.type === 'income' ? 'text-green-500' : 'text-red-500'">
            {{ transaction.type === 'income' ? '+' : '-' }}{{ transaction.amount.toLocaleString() }} €
          </span>
        </li>
      </ul>
      <p v-else class="text-gray-500">No hay transacciones recientes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '../store/transactions';
import { useModalStore } from '../store/modal';
import { onMounted } from 'vue';

// Test Data
onMounted(() => {
  if (store.transactions.length === 0) {
    store.addTransaction({ id: '1', amount: 1000, type: 'income', category: 'Salario', date: '2024-02-03' });
    store.addTransaction({ id: '2', amount: 200, type: 'expense', category: 'Comida', date: '2024-02-03' });
    store.addTransaction({ id: '3', amount: 50, type: 'expense', category: 'Transporte', date: '2024-02-03' });
  }
});

// Usar el store de Pinia
const modalStore = useModalStore();

// Obtener el store de transacciones
const store = useTransactionStore();
const { balance, totalIncome, totalExpense, transactions } = storeToRefs(store);

// Definir recentTransactions para obtener las últimas 5 transacciones
const recentTransactions = computed(() => {
  return transactions.value && transactions.value.length > 0
    ? transactions.value.slice(-5).reverse()
    : [];
});
defineEmits(['open-modal']);
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>