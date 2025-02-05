import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transaction } from '../types/Transaction';

export const useTransactionStore = defineStore('transactions', () => {
  // Estado reactivo de transacciones
  const transactions = ref<Transaction[]>([]);

  // Acción para agregar una transacción
  const addTransaction = (transaction: Transaction) => {
    transactions.value.push({ ...transaction, id: Date.now().toString() });
  };

  // Acción para eliminar una transacción por ID
  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter(t => t.id !== id);
  };

  // Getters para cálculos
  const totalIncome = computed(() =>
    transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpense = computed(() =>
    transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = computed(() =>
    transactions.value.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
  );

  return { transactions, addTransaction, deleteTransaction, totalIncome, totalExpense, balance };
});

