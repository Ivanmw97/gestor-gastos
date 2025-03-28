import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Transaction } from '../types/Transaction';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);

  return {
    transactions
  };
}, {
  persist: true
});

