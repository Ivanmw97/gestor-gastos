<template>
  <div class="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
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
    <nav class="flex-1 py-6 px-4 space-y-2">
      <p class="text-gray-400 text-xs font-medium px-2 mb-4">MENU</p>
      <SidebarItem to="/" icon="layout-dashboard" label="Dashboard" />
      <SidebarItem to="/transactions" icon="bank" label="Transactions" />
      <SidebarItem to="/budgets" icon="wallet" label="Budgets" />
      <SidebarItem to="/stats" icon="bar-chart" label="Stats" />
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-2 py-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium">Financial Manager</p>
          <p class="text-xs text-gray-400">v1.0.1</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import SidebarItem from '../components/SidebarItem.vue';
</script>
  