import { defineStore } from 'pinia';
import type { Transaction } from '../types/Transaction';

const getStoredTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem('transactions');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: getStoredTransactions()
  }),
  
  actions: {
    addTransaction(transaction: Transaction) {
      this.transactions.push(transaction);
      this.saveToLocalStorage();
    },

    updateTransaction(updatedTransaction: Transaction) {
      const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
        this.saveToLocalStorage();
      }
    },

    removeTransaction(id: string) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
      } catch (error) {
        console.error('Error saving transactions:', error);
      }
    },

    // Add method to load transactions
    loadTransactions() {
      this.transactions = getStoredTransactions();
    }
  }
});

