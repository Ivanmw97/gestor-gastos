import { defineStore } from 'pinia';
import type { Transaction } from '../types/Transaction';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
  }),
  actions: {
    addTransaction(transaction: Transaction) {
      this.transactions.push(transaction);
    },
    deleteTransaction(id: string) {
      this.transactions = this.transactions.filter(t => t.id !== id);
    },
  },
  getters: {
    totalIncome: (state): number => {
        return state.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    },
    totalExpense: (state): number => {
        return state.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    },
    balance: (state): number => {
        return (state as any).totalIncome - (state as any).totalExpense;
    }
  },
});
