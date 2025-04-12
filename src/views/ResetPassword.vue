<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
    <div class="bg-white p-10 rounded-lg shadow-xl max-w-xl w-full">
      <div class="flex flex-col items-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 class="text-3xl font-bold text-gray-800 mb-3">Reset Your Password</h2>
        <p class="text-gray-600 text-center text-lg">Enter your new password below</p>
      </div>

      <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-base">
        {{ error }}
      </div>

      <div v-if="success" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-base">
        {{ success }}
      </div>

      <form v-if="!success" class="space-y-6" @submit.prevent="handleResetPassword">
        <div>
          <label for="password" class="block text-base font-medium text-gray-700 mb-2">New Password</label>
          <div class="relative">
            <input 
              id="password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
              minlength="8"
              @input="checkPasswordStrength"
            />
            <button 
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
          
          <!-- Password strength indicator with increased size -->
          <div class="mt-3">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-500">Password strength:</span>
              <span class="text-sm font-medium" :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: `${passwordStrength}%` }"
              ></div>
            </div>
          </div>

          <ul class="mt-3 text-sm text-gray-500 space-y-2">
            <li class="flex items-center">
              <span :class="password.length >= 8 ? 'text-green-500' : 'text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              At least 8 characters
            </li>
            <li class="flex items-center">
              <span :class="/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              Contains uppercase letter
            </li>
            <li class="flex items-center">
              <span :class="/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              Contains number
            </li>
          </ul>
        </div>

        <div>
          <label for="confirmPassword" class="block text-base font-medium text-gray-700 mb-2">Confirm Password</label>
          <div class="relative">
            <input 
              id="confirmPassword" 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              class="w-full px-4 py-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
          <p v-if="confirmPassword && password !== confirmPassword" class="mt-2 text-sm text-red-500">
            Passwords do not match
          </p>
        </div>

        <button 
          type="submit" 
          class="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </span>
          <span v-else>Reset Password</span>
        </button>
      </form>

      <div v-if="success" class="mt-8 text-center">
        <button 
          class="inline-flex items-center px-6 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="goToLogin" 
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const router = useRouter();
const route = useRoute();

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');
const passwordStrength = ref(0);

onMounted(() => {
  if (!route.hash) {
    error.value = 'Invalid or expired password reset link. Please request a new one.';
  }
});

// Password strength calculation
const checkPasswordStrength = () => {
  const pwd = password.value;
  let strength = 0;
  
  // Length check
  if (pwd.length >= 8) strength += 25;
  
  // Contains uppercase letter
  if (/[A-Z]/.test(pwd)) strength += 25;
  
  // Contains number
  if (/[0-9]/.test(pwd)) strength += 25;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
  
  passwordStrength.value = strength;
};

const passwordStrengthText = computed(() => {
  if (passwordStrength.value === 0) return 'None';
  if (passwordStrength.value <= 25) return 'Weak';
  if (passwordStrength.value <= 50) return 'Fair';
  if (passwordStrength.value <= 75) return 'Good';
  return 'Strong';
});

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value === 0) return 'text-gray-400 bg-gray-200';
  if (passwordStrength.value <= 25) return 'text-red-500 bg-red-500';
  if (passwordStrength.value <= 50) return 'text-orange-500 bg-orange-500';
  if (passwordStrength.value <= 75) return 'text-yellow-500 bg-yellow-500';
  return 'text-green-500 bg-green-500';
});

const isFormValid = computed(() => {
  return (
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    passwordStrength.value >= 50 // Require at least a fair password
  );
});

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value
    });
    
    if (updateError) throw updateError;
    
    success.value = 'Your password has been reset successfully!';
    password.value = '';
    confirmPassword.value = '';
    
  } catch (err: any) {
    error.value = err.message || 'Failed to reset password';
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/auth');
};
</script>