import { defineStore } from 'pinia';
import type { Budget } from '../types/Budget';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from './user';

export const useBudgetStore = defineStore('budgets', {
  state: () => ({
    budgets: [] as Budget[],
    currentMonth: new Date().toISOString().substring(0, 7),
    isLoading: false
  }),
  
  actions: {
    async loadBudgets() {
      const userStore = useUserStore();
      
      // Clear existing budgets first to avoid mixing data
      this.budgets = [];
      
      // If in guest mode, load from localStorage
      if (userStore.isGuestMode) {
        try {
          const stored = localStorage.getItem('budgets');
          if (stored) {
            this.budgets = JSON.parse(stored);
          }
          console.log('Loaded budgets from localStorage:', this.budgets.length);
        } catch (error) {
          console.error('Error loading budgets from localStorage:', error);
        }
        return;
      }
      
      // Otherwise load from Supabase
      try {
        this.isLoading = true;
        
        if (!userStore.user?.id) {
          console.log('No user ID available, cannot load budgets');
          return;
        }
        
        console.log('Loading budgets for user:', userStore.user.id);
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', userStore.user.id)
          .eq('month', this.currentMonth);
          
        if (error) {
          console.error('Supabase error loading budgets:', error);
          throw error;
        }
        
        this.budgets = data || [];
        console.log('Loaded budgets from Supabase:', this.budgets.length);
      } catch (error) {
        console.error('Error loading budgets from Supabase:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addBudget(budget: Omit<Budget, 'id'>) {
      const userStore = useUserStore();
      
      // If in guest mode, save to localStorage
      if (userStore.isGuestMode) {
        const newBudget = {
          ...budget,
          id: crypto.randomUUID()
        };
        
        this.budgets.push(newBudget);
        this.saveToLocalStorage();
        return newBudget;
      }
      
      // Otherwise save to Supabase
      try {
        if (!userStore.user?.id) {
          console.error('Cannot add budget: No user ID available');
          return;
        }
        
        console.log('Adding budget to Supabase for user:', userStore.user.id);
        
        // Make sure we have the correct structure for the budget
        const newBudget = {
          ...budget,
          user_id: userStore.user.id,
          month: this.currentMonth
        };
        
        console.log('Budget data being sent:', newBudget);
        
        const { data, error } = await supabase
          .from('budgets')
          .insert(newBudget)
          .select()
          .single();
          
        if (error) {
          console.error('Supabase error adding budget:', error);
          throw error;
        }
        
        if (data) {
          console.log('Budget successfully added to Supabase:', data);
          this.budgets.push(data);
          return data;
        } else {
          console.warn('No data returned from Supabase after adding budget');
        }
      } catch (error) {
        console.error('Error adding budget to Supabase:', error);
      }
    },

    // Update the updateBudget method to use budget_limit
    async updateBudget(category: string, budget_limit: number) {
      const budget = this.budgets.find(b => b.category === category);
      if (!budget) return;
      
      budget.budget_limit = budget_limit;
      
      const userStore = useUserStore();
      
      if (userStore.isGuestMode) {
        this.saveToLocalStorage();
        return;
      }
      
      try {
        // Update in Supabase
        if (!userStore.user?.id) {
          console.error('Cannot update budget: No user ID available');
          return;
        }
        
        console.log('Updating budget in Supabase:', budget.id);
        
        // Make sure we're not sending any extra fields that might cause issues
        const { id, ...budgetData } = budget;
        const dataToUpdate = {
          ...budgetData,
          user_id: userStore.user.id,
          month: this.currentMonth
        };
        
        console.log('Budget data being updated:', dataToUpdate);
        
        const { error } = await supabase
          .from('budgets')
          .update(dataToUpdate)
          .eq('id', id)
          .eq('user_id', userStore.user.id);
          
        if (error) {
          console.error('Supabase error updating budget:', error);
          throw error;
        }
        
        console.log('Budget successfully updated in Supabase');
        
        // Update local state is already done by modifying the budget object directly
      } catch (error) {
        console.error('Error updating budget in Supabase:', error);
      }
    },

    async removeBudget(id: string) {
      const userStore = useUserStore();
      
      // If in guest mode, remove from localStorage
      if (userStore.isGuestMode) {
        this.budgets = this.budgets.filter(b => b.id !== id);
        this.saveToLocalStorage();
        return;
      }
      
      // Otherwise remove from Supabase
      try {
        if (!userStore.user?.id) return;
        
        const { error } = await supabase
          .from('budgets')
          .delete()
          .eq('id', id)
          .eq('user_id', userStore.user.id);
          
        if (error) throw error;
        
        // Update local state
        this.budgets = this.budgets.filter(b => b.id !== id);
      } catch (error) {
        console.error('Error removing budget from Supabase:', error);
      }
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
      } catch (error) {
        console.error('Error saving budgets to localStorage:', error);
      }
    },

    async checkMonthlyReset() {
      const userStore = useUserStore();
      const newMonth = new Date().toISOString().substring(0, 7);
      
      // If month has changed, update current month
      if (this.currentMonth !== newMonth) {
        this.currentMonth = newMonth;
        
        // If not in guest mode, load budgets for the new month
        if (!userStore.isGuestMode && userStore.user?.id) {
          await this.loadBudgets();
        }
      }
    }
  }
});