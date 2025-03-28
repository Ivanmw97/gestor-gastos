import { defineStore } from 'pinia';
import type { Transaction } from '../types/Transaction';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[]
  }),
  
  actions: {
    addTransaction(transaction: Transaction) {
      this.transactions.push(transaction);
    },

    updateTransaction(updatedTransaction: Transaction) {
      const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
      }
    },

    removeTransaction(id: string) {
      this.transactions = this.transactions.filter(t => t.id !== id);
    }
  }
});

