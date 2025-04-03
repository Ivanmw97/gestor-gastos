<template>
  <!-- Mobile Menu Button -->
  <button 
    class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    @click="toggleSidebar"
  >
    <Menu v-if="!isOpen" class="h-6 w-6" />
    <X v-else class="h-6 w-6" />
  </button>

  <!-- Sidebar -->
  <div :class="[
    'fixed lg:relative h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl transition-transform duration-300 z-40',
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
        </svg>
        <div>
          <span class="text-blue-500 font-bold text-xl">Financial</span>
          <span class="text-white font-medium text-xl">Manager</span>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
      <div class="flex items-center gap-2 px-2 mb-4">
        <div class="h-px bg-gray-800 flex-grow"></div>
        <p class="text-gray-400 text-xs font-medium">MENU</p>
        <div class="h-px bg-gray-800 flex-grow"></div>
      </div>
      <SidebarItem :icon="LayoutDashboard" label="Dashboard" to="/dashboard" />
      <SidebarItem :icon="ReceiptEuro" label="Transactions" to="/transactions" />
      <SidebarItem :icon="Wallet" label="Budgets" to="/budgets" />
      <SidebarItem :icon="BarChart" label="Stats" to="/stats" />
    </nav>

    <!-- Footer with UserProfile -->
    <div class="border-t border-gray-800">
      <!-- User Profile -->
      <div class="p-4 mb-2">
        <UserProfile />
      </div>
      
      <!-- App Info -->
      <div class="px-6 py-3 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium">Financial Manager</p>
          <p class="text-xs text-gray-400 version">v1.2.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import SidebarItem from '../components/SidebarItem.vue';
import { Menu, X, LayoutDashboard, Wallet, BarChart, ReceiptEuro } from 'lucide-vue-next';
import UserProfile from './UserProfile.vue';

const isOpen = ref(false);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

// Provide the close function to child components
provide('closeSidebar', () => {
  isOpen.value = false;
});
</script>
  