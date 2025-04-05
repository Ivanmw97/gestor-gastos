<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
      <!-- Header -->
      <div class="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div class="flex justify-center items-center gap-3 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
          </svg>
          <h1 class="text-3xl font-bold">Financial Manager</h1>
        </div>
        <p class="text-sm text-blue-100">Sign in to access your financial data from any device</p>
      </div>

      <!-- Auth Form -->
      <div class="p-8">
        <div class="mb-8">
          <div class="flex border-b border-gray-200">
            <button 
              class="flex-1 py-3 text-center font-medium transition-all duration-200"
              :class="mode === 'signin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
              @click="mode = 'signin'" 
            >
              Sign In
            </button>
            <button 
              class="flex-1 py-3 text-center font-medium transition-all duration-200"
              :class="mode === 'signup' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'"
              @click="mode = 'signup'" 
            >
              Sign Up
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errorMsg }}
          </div>
        </div>

        <!-- Sign In Form -->
        <form v-if="mode === 'signin'" class="space-y-5" @submit.prevent="handleSignIn">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                  required
              />
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                  id="password" 
                  v-model="password" 
                  type="password" 
                  class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
              />
            </div>
          </div>
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Sign Up Form -->
        <form v-if="mode === 'signup'" class="space-y-5" @submit.prevent="handleSignUp">
          <!-- First Name and Last Name fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                    id="first-name"   
                    v-model="firstName" 
                    type="text" 
                    class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name"
                    required
                />
              </div>
            </div>
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                    id="last-name"   
                    v-model="lastName" 
                    type="text" 
                    class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Last Name"
                    required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input 
                  id="signup-email"   
                  v-model="email" 
                  type="email" 
                  class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                  required
              />
            </div>
          </div>
          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                  id="signup-password" 
                  v-model="password" 
                  type="password" 
                  class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
              />
            </div>
          </div>
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <!-- Guest Access -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <button 
            class="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            @click="handleGuestAccess" 
          >
            Continue as Guest
          </button>
          <div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="ml-2 text-xs text-amber-800">
              <span class="font-medium">Local storage only:</span> Your data will be saved on this device only and cannot be accessed from other devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

const mode = ref<'signin' | 'signup'>('signin');
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleSignIn = async () => {
  try {
    loading.value = true;
    errorMsg.value = '';
    
    // Use the store's signIn method instead of directly calling Supabase
    const result = await userStore.signIn(email.value, password.value);

    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Clear any guest mode data
    localStorage.removeItem('guest_transactions');
    localStorage.removeItem('guest_budgets');
    
    router.push('/dashboard');
  } catch (error: any) {
    errorMsg.value = error.message || 'Failed to sign in';
  } finally {
    loading.value = false;
  }
};

const handleSignUp = async () => {
  try {
    loading.value = true;
    errorMsg.value = '';
    
    if (!firstName.value || !lastName.value) {
      errorMsg.value = 'Please enter your first and last name';
      loading.value = false;
      return;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: firstName.value,
          last_name: lastName.value
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
          first_name: firstName.value,
          last_name: lastName.value,
          currency: '€',
          theme: 'light'
        });
       
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway since the user was created
      }
      
      await userStore.setUser(data.user);
      router.push('/dashboard');
    } else {
      // Email confirmation required
      errorMsg.value = 'Please check your email for a confirmation link';
    }
  } catch (error: any) {
    errorMsg.value = error.message || 'Failed to create account';
  } finally {
    loading.value = false;
  }
};

const handleGuestAccess = () => {
  // Clear any existing data first
  localStorage.removeItem('transactions');
  localStorage.removeItem('budgets');
  localStorage.removeItem('guest_transactions');
  localStorage.removeItem('guest_budgets');
  
  userStore.setGuestMode(true);
  router.push('/dashboard');
};
</script>