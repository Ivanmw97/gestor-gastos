<template>
  <div
    v-if="modalStore.isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4">Añadir Nueva Transacción</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Categoría -->
        <label class="block mb-2">Categoría:</label>
        <input
          v-model="newTransaction.category"
          type="text"
          required
          class="border p-2 w-full rounded-md mb-4"
        />

        <!-- Cantidad -->
        <label class="block mb-2">Cantidad (€):</label>
        <input
          v-model.number="newTransaction.amount"
          type="number"
          required
          class="border p-2 w-full rounded-md mb-4"
        />

        <!-- Tipo (Ingreso / Gasto) -->
        <label class="block mb-2">Tipo:</label>
        <select
          v-model="newTransaction.type"
          required
          class="border p-2 w-full rounded-md mb-4"
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>

        <!-- Botones -->
        <div class="flex justify-between mt-4">
          <button type="button" @click="modalStore.closeModal()" class="text-gray-500">
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModalStore } from '../store/modal';
import { useTransactionStore } from '../store/transactions';
import type { Transaction } from '../types/Transaction';

// Usar el store de Pinia
const modalStore = useModalStore();
const transactionStore = useTransactionStore();

// Modelo de la nueva transacción
const newTransaction = ref<Transaction>({
  id: '',
  category: '',
  amount: 0,
  type: 'income',
  date: new Date().toISOString(),
});

// Función para añadir transacción
const handleSubmit = () => {
  if (!newTransaction.value.category || newTransaction.value.amount <= 0) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  transactionStore.addTransaction(newTransaction.value);

  // Limpiar formulario y cerrar modal
  newTransaction.value = { id: '', category: '', amount: 0, type: 'income', date: new Date().toISOString() };
  modalStore.closeModal();
};
</script>

  