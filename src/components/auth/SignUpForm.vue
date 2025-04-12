<template>
  <form class="space-y-5" @submit.prevent="handleSignUp">
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
            :type="showPassword ? 'text' : 'password'"
            class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
            required
            @input="checkPasswordStrength"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button 
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="togglePasswordVisibility('password')"                   
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Password strength indicator -->
      <div class="mt-2">
        <div class="flex justify-between mb-1">
          <span class="text-xs text-gray-500">Password strength:</span>
          <span class="text-xs" :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
        </div>
        <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            :class="passwordStrengthColor"
            :style="{ width: `${passwordStrength}%` }"
          ></div>
        </div>
        <ul class="mt-2 text-xs text-gray-500 space-y-1">
          <li class="flex items-center">
            <span :class="password.length >= 8 ? 'text-green-500' : 'text-gray-400'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            At least 8 characters
          </li>
          <li class="flex items-center">
            <span :class="/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Contains uppercase letter
          </li>
          <li class="flex items-center">
            <span :class="/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            Contains number
          </li>
        </ul>
      </div>
    </div>
    
    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <input 
            id="confirm-password" 
            v-model="confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            class="w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
            required
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button 
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="togglePasswordVisibility('confirm')" 
          >
            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          </button>
        </div>
      </div>
      <p v-if="confirmPassword && password !== confirmPassword" class="mt-1 text-xs text-red-500">
        Passwords do not match
      </p>
    </div>
    
    <!-- Terms of service -->
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="terms"
          v-model="acceptTerms"
          type="checkbox"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          required
        />
      </div>
      <div class="ml-3 text-sm">
        <label for="terms" class="text-gray-600">
          I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500" @click.prevent="$emit('show-terms')">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-500" @click.prevent="$emit('show-privacy')">Privacy Policy</a>
        </label>
      </div>
    </div>
    
    <button 
      type="submit" 
      class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
      :disabled="loading || !isFormValid"
    >
      <span v-if="loading" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing up...
      </span>
      <span v-else>Sign Up</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const { loading } = defineProps<{
  loading: boolean
}>();

const emit = defineEmits<{
  (e: 'sign-up', formData: {
    email: string,
    password: string,
    firstName: string,
    lastName: string
  }): void
  (e: 'show-terms'): void
  (e: 'show-privacy'): void
}>();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordStrength = ref(0);
const acceptTerms = ref(false);

// Password strength calculation
const checkPasswordStrength = () => {
  const pwd = password.value;
  let strength = 0;
  
  // Length check
  if (pwd.length >= 8) strength += 25;
  
  // Contains uppercase
  if (/[A-Z]/.test(pwd)) strength += 25;
  
  // Contains lowercase
  if (/[a-z]/.test(pwd)) strength += 25;
  
  // Contains number
  if (/[0-9]/.test(pwd)) strength += 25;
  
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
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    password.value === confirmPassword.value &&
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    acceptTerms.value &&
    passwordStrength.value >= 50 // Require at least a fair password
  );
});

const togglePasswordVisibility = (field: 'password' | 'confirm') => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

const handleSignUp = () => {
  if (isFormValid.value) {
    emit('sign-up', {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value
    });
  }
};
</script>