import { defineStore } from 'pinia';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { getActivePinia } from 'pinia';

interface UserSignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
    isGuestMode: false
  }),
  
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    
    async initialize() {
      this.isLoading = true;
      
      try {
        // First check if we're in guest mode (from localStorage)
        const storedGuestMode = localStorage.getItem('guestMode');
        if (storedGuestMode === 'true') {
          this.isGuestMode = true;
          console.log('Initialized in guest mode');
          return;
        }
        
        // Otherwise try to get the user session
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error.message);
          return;
        }
        
        if (data?.user) {
          this.user = data.user;
          console.log('User authenticated:', this.user.email);
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Error in initialize:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async setGuestMode(value: boolean) {
      // If switching to guest mode, reset all other stores first
      if (value) {
        const pinia = getActivePinia();
        if (pinia) {
          // Get store IDs from state
          const storeIds = Object.keys(pinia.state.value);
          
          // Import stores dynamically to reset them
          if (storeIds.includes('transactions')) {
            const { useTransactionStore } = await import('./transactions');
            useTransactionStore().$reset();
          }
          
          if (storeIds.includes('budgets')) {
            const { useBudgetStore } = await import('./budgets');
            useBudgetStore().$reset();
          }
        }
      }
      
      this.isGuestMode = value;
      localStorage.setItem('guestMode', value.toString());
      console.log('Guest mode set to:', value);
    },
    
    async signIn(email: string, password: string, sessionOptions = {}) {
      this.isLoading = true;
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: sessionOptions
        });
        
        if (error) throw error;

        if (data.user) {
          this.user = data.user;
          this.isGuestMode = false;
          localStorage.removeItem('guestMode');
          this.setUser(data.user);
          return { success: true };
        } else {
          return { success: false, error: 'No user data returned' };
        }
      } 
      catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
        console.error('Sign in error:', errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async signUp(userData: UserSignUpData) {
      this.isLoading = true;
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.first_name,
              last_name: userData.last_name
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Create a profile for the new user
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              currency: '€',
              theme: 'light'
            });
           
          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Continue anyway since the user was created
          }
        }
        
        return { success: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
        console.error('Sign up error:', errorMessage);
        return { 
          success: false, 
          error: errorMessage
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async signOut() {
      this.isLoading = true;
      
      try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        this.user = null;
        this.isGuestMode = false;
        
        // Clear all localStorage data
        localStorage.removeItem('guestMode');
        localStorage.removeItem('transactions');
        localStorage.removeItem('budgets');
        localStorage.removeItem('guest_transactions');
        localStorage.removeItem('guest_budgets');
        
        const pinia = getActivePinia();
        if (pinia) {
          // Get store IDs from state
          const storeIds = Object.keys(pinia.state.value);
          
          // Import stores dynamically to reset them
          if (storeIds.includes('transactions')) {
            const { useTransactionStore } = await import('./transactions');
            useTransactionStore().$reset();
          }
          
          if (storeIds.includes('budgets')) {
            const { useBudgetStore } = await import('./budgets');
            useBudgetStore().$reset();
          }
        }
        
        return { success: true };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
        console.error('Sign out error:', errorMessage);
        return { 
          success: false, 
          error: errorMessage
        };
      } finally {
        this.isLoading = false;
      }
    }
  }
});