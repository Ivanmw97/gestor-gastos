<template>
  <div class="w-screen h-screen flex overflow-hidden">
    <!-- Left side: Auth Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
      
        <h2 class="text-center text-3xl font-extrabold text-white">
          {{ mode === 'signin' ? 'Welcome back!' : 'Join us today' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ mode === 'signin' ? 'Don\'t have an account? ' : 'Already have an account? ' }}
          <a href="#" 
             class="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200"
             @click.prevent="mode = mode === 'signin' ? 'signup' : 'signin'">
            {{ mode === 'signin' ? 'Create one now' : 'Sign in here' }}
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <!-- Error message -->
          <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {{ errorMsg }}
          </div>
          
          <!-- Sign In Form -->
          <SignInForm 
            v-if="mode === 'signin'" 
            :loading="loading"
            @sign-in="handleSignIn"
            @forgot-password="showForgotPasswordModal = true"
            @social-sign-in="handleSocialSignIn"
            @guest-access="handleGuestAccess"
          />
          
          <!-- Sign Up Form -->
          <SignUpForm 
            v-else 
            :loading="loading"
            @sign-up="handleSignUp"
            @show-terms="showTermsModal = true"
            @show-privacy="showPrivacyModal = true"
          />
        
          <!-- Guest Info -->
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

    <!-- Right side: App Info -->
    <div class="hidden lg:flex lg:w-1/2 h-full bg-blue-600 relative overflow-hidden">
      <div class="flex flex-col justify-center items-start w-full h-full p-12 z-10 relative">
        <!-- App Logo and Name -->
        <div class="flex items-center gap-3 mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <span class="text-white font-bold text-xl">Financial</span>
            <span class="text-blue-100 font-medium text-xl">Manager</span>
          </div>
        </div>

        <h1 class="text-4xl font-bold text-white mb-6">Manage Your Finances with Ease</h1>
        <div class="space-y-6 text-blue-100">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <h3 class="font-semibold text-white">Track Expenses</h3>
              <p class="text-sm">Monitor your daily spending and stay on top of your finances</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <div>
              <h3 class="font-semibold text-white">Budget Management</h3>
              <p class="text-sm">Set and manage budgets to reach your financial goals</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <h3 class="font-semibold text-white">Visual Analytics</h3>
              <p class="text-sm">Get insights with detailed charts and statistics</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Decorative background -->
      <div class="absolute inset-0 overflow-hidden rounded-none">
        <!-- Gradient layer -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-70 z-0"></div>

        <!-- Pattern overlay -->
        <div 
          class="absolute inset-0 bg-repeat z-10 opacity-10"
          style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle fill=%22white%22 fill-opacity=%220.2%22 cx=%2250%22 cy=%2250%22 r=%224%22/%3E%3C/svg%3E');"
        ></div>
      </div>
    </div>
</div>

  <!-- Modals -->
  <TermsModal v-if="showTermsModal" @close="showTermsModal = false" />
  <PrivacyModal v-if="showPrivacyModal" @close="showPrivacyModal = false" />
  <ForgotPasswordModal 
    v-if="showForgotPasswordModal" 
    @close="showForgotPasswordModal = false"
    @success="handlePasswordResetSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../store/user';
import SignInForm from '../components/auth/SignInForm.vue';
import SignUpForm from '../components/auth/SignUpForm.vue';
import TermsModal from '../components/auth/TermsModal.vue';
import PrivacyModal from '../components/auth/PrivacyModal.vue';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal.vue';

const router = useRouter();
const userStore = useUserStore();

const mode = ref<'signin' | 'signup'>('signin');
const errorMsg = ref('');
const loading = ref(false);
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);
const showForgotPasswordModal = ref(false);

const handleSignIn = async (email: string, password: string) => {
  try {
    loading.value = true;
    errorMsg.value = '';
    
    const result = await userStore.signIn(email, password);

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

const handleSignUp = async (formData: {
  email: string,
  password: string,
  firstName: string,
  lastName: string
}) => {
  try {
    loading.value = true;
    errorMsg.value = '';
    
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName
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
          first_name: formData.firstName,
          last_name: formData.lastName,
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

const handleSocialSignIn = async (provider: 'google') => {
  try {
    loading.value = true;
    errorMsg.value = '';

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'https://dmrtbyrtvemnohwhlvnr.supabase.co/auth/v1/callback'
      }
    });
    
    if (error) throw error;
    
  } catch (error: any) {
    errorMsg.value = error.message || `Failed to sign in with ${provider}`;
    loading.value = false;
  }
};

const handlePasswordResetSuccess = () => {
  errorMsg.value = '';
};
</script>