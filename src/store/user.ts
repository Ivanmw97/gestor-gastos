import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(true);
  const isGuestMode = ref(false);
  
  // Initialize user on app load
  const initialize = async () => {
    isLoading.value = true;
    
    try {
      // Check if we have a stored guest mode preference
      const storedGuestMode = localStorage.getItem('guestMode');
      if (storedGuestMode === 'true') {
        isGuestMode.value = true;
        isLoading.value = false;
        return;
      }
      
      // Check for existing session
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        user.value = data.session.user;
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const setUser = async (newUser: User | null) => {
    user.value = newUser;
    isGuestMode.value = false;
    localStorage.removeItem('guestMode');
  };
  
  const setGuestMode = (value: boolean) => {
    isGuestMode.value = value;
    user.value = null;
    localStorage.setItem('guestMode', value.toString());
  };
  
  const signOut = async () => {
    if (isGuestMode.value) {
      isGuestMode.value = false;
      localStorage.removeItem('guestMode');
    } else {
      await supabase.auth.signOut();
      user.value = null;
    }
  };
  
  return {
    user,
    isLoading,
    isGuestMode,
    initialize,
    setUser,
    setGuestMode,
    signOut
  };
});