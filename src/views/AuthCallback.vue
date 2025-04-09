<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Completing sign in...</h2>
        <p class="text-gray-600 text-center">Please wait while we authenticate your account.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // Get the auth code from the URL
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
      router.push('/auth?error=auth_callback_error');
      return;
    }
    
    if (data?.session) {
      // Set the user in the store
      await userStore.setUser(data.session.user);
      
      // Clear any guest mode data
      localStorage.removeItem('guest_transactions');
      localStorage.removeItem('guest_budgets');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      // No session found, redirect back to auth
      router.push('/auth');
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    router.push('/auth?error=auth_callback_error');
  }
});
</script>