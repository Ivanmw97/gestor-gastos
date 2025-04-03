<template>
  <div class="relative">
    <button 
      class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full"
      @click="isOpen = !isOpen"
    >
      <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
        {{ userInitial }}
      </div>
      <div class="flex-1 text-left">
        <p class="text-sm font-medium truncate">{{ displayName }}</p>
        <p class="text-xs text-gray-400">{{ userStatus }}</p>
      </div>
      <ChevronDown :class="['h-4 w-4 text-gray-400 transition-transform', isOpen ? 'rotate-180' : '']" />
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute bottom-full left-0 w-full bg-gray-800 rounded-lg shadow-lg py-2 mb-2 border border-gray-700 z-10"
    >
      <div class="px-4 py-2 border-b border-gray-700">
        <p class="text-sm font-medium">{{ displayName }}</p>
        <p class="text-xs text-gray-400">{{ userEmail }}</p>
      </div>
      <button 
        class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
        @click="signOut"
      >
        <LogOut class="h-4 w-4" />
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import { ChevronDown, LogOut } from 'lucide-vue-next';
import { supabase } from '../lib/supabaseClient';

const userStore = useUserStore();
const router = useRouter();
const isOpen = ref(false);
const userProfile = ref<any>(null);

// Fetch user profile from database
onMounted(async () => {
  if (!userStore.isGuestMode && userStore.user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userStore.user.id)
        .single();
        
      if (error) throw error;
      userProfile.value = data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
});

const firstName = computed(() => {
  if (userStore.isGuestMode) return 'Guest';
  // First try to get from DB profile
  if (userProfile.value?.first_name) return userProfile.value.first_name;
  // Then try metadata
  return userStore.user?.user_metadata?.first_name || 
         userStore.user?.email?.split('@')[0].split('.')[0] || 'User';
});

const lastName = computed(() => {
  if (userStore.isGuestMode) return 'User';
  // First try to get from DB profile
  if (userProfile.value?.last_name) return userProfile.value.last_name;
  // Then try metadata
  return userStore.user?.user_metadata?.last_name || 
         (userStore.user?.email?.split('@')[0].includes('.') ? 
          userStore.user?.email?.split('@')[0].split('.')[1] : '');
});

const displayName = computed(() => {
  if (userStore.isGuestMode) return 'Guest User';
  if (firstName.value && lastName.value) {
    return `${firstName.value} ${lastName.value}`;
  }
  return userStore.user?.email?.split('@')[0] || 'User';
});

const userEmail = computed(() => {
  if (userStore.isGuestMode) return 'Guest Mode';
  return userStore.user?.email || '';
});

const userStatus = computed(() => {
  return userStore.isGuestMode ? 'Guest Mode' : 'Signed In';
});

const userInitial = computed(() => {
  if (userStore.isGuestMode) return 'G';
  const firstInitial = firstName.value.charAt(0).toUpperCase();
  const lastInitial = lastName.value ? lastName.value.charAt(0).toUpperCase() : '';
  return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
});

const signOut = async () => {
  if (userStore.isGuestMode) {
    userStore.setGuestMode(false);
  } else {
    await userStore.signOut();
  }
  isOpen.value = false;
  router.push('/auth');
};
</script>