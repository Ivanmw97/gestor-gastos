import { defineStore } from 'pinia';
import type { Transaction } from '../types/Transaction';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from './user';

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
    isLoading: false
  }),
  
  getters: {
    getTransactionsByMonth: (state) => (month: string) => {
      return state.transactions.filter(t => t.date.startsWith(month));
    },

    availableMonths: (state) => {
      const months = new Set(state.transactions.map(t => t.date.substring(0, 7)));
      return Array.from(months).sort().reverse();
    },

    currentMonthTransactions: (state) => {
      const currentMonth = new Date().toISOString().substring(0, 7);
      return state.transactions.filter(t => t.date.startsWith(currentMonth));
    }
  },
  
  actions: {
    async loadTransactions() {
      const userStore = useUserStore();
      
      // Clear existing transactions first to avoid mixing data
      this.transactions = [];
      
      // If in guest mode, load from localStorage
      if (userStore.isGuestMode) {
        try {
          const stored = localStorage.getItem('transactions');
          if (stored) {
            this.transactions = JSON.parse(stored);
          }
          console.log('Loaded transactions from localStorage:', this.transactions.length);
        } catch (error) {
          console.error('Error loading transactions from localStorage:', error);
        }
        return;
      }
      
      // Otherwise load from Supabase
      try {
        this.isLoading = true;
        
        if (!userStore.user?.id) {
          console.log('No user ID available, cannot load transactions');
          return;
        }
        
        console.log('Loading transactions for user:', userStore.user.id);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userStore.user.id)
          .order('date', { ascending: false });
          
        if (error) {
          console.error('Supabase error loading transactions:', error);
          throw error;
        }
        
        this.transactions = data || [];
        console.log('Loaded transactions from Supabase:', this.transactions.length);
      } catch (error) {
        console.error('Error loading transactions from Supabase:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addTransaction(transaction: Omit<Transaction, 'id'>) {
      const userStore = useUserStore();
      
      // If in guest mode, save to localStorage
      if (userStore.isGuestMode) {
        const newTransaction = {
          ...transaction,
          id: crypto.randomUUID()
        };
        
        this.transactions.push(newTransaction);
        this.saveToLocalStorage();
        return newTransaction;
      }
      
      // Otherwise save to Supabase
      try {
        if (!userStore.user?.id) return;
        
        const newTransaction = {
          ...transaction,
          user_id: userStore.user.id
        };
        
        const { data, error } = await supabase
          .from('transactions')
          .insert(newTransaction)
          .select()
          .single();
          
        if (error) throw error;
        
        if (data) {
          this.transactions.push(data);
          return data;
        }
      } catch (error) {
        console.error('Error adding transaction to Supabase:', error);
      }
    },

    async updateTransaction(updatedTransaction: Transaction) {
      const userStore = useUserStore();
      
      // If in guest mode, update in localStorage
      if (userStore.isGuestMode) {
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
          this.saveToLocalStorage();
        }
        return;
      }
      
      // Otherwise update in Supabase
      try {
        if (!userStore.user?.id) return;
        
        const { error } = await supabase
          .from('transactions')
          .update(updatedTransaction)
          .eq('id', updatedTransaction.id)
          .eq('user_id', userStore.user.id);
          
        if (error) throw error;
        
        // Update local state
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
      } catch (error) {
        console.error('Error updating transaction in Supabase:', error);
      }
    },

    async removeTransaction(id: string) {
      const userStore = useUserStore();
      
      // If in guest mode, remove from localStorage
      if (userStore.isGuestMode) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToLocalStorage();
        return;
      }
      
      // Otherwise remove from Supabase
      try {
        if (!userStore.user?.id) return;
        
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id)
          .eq('user_id', userStore.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.transactions = this.transactions.filter(t => t.id !== id);
      } catch (error) {
        console.error('Error removing transaction from Supabase:', error);
      }
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
      } catch (error) {
        console.error('Error saving transactions to localStorage:', error);
      }
    }
  }
});

