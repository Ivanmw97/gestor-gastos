<template>
    <div class="h-screen w-64 bg-gray-900 text-white flex flex-col">
      <!-- Logo -->
      <div class="p-4 text-lg font-semibold tracking-wide border-b border-gray-700">
        <span class="text-blue-500">Gestor</span> Financiero
      </div>
  
      <!-- Menú -->
      <nav class="flex-1 mt-4">
        <p class="text-gray-400 text-xs px-4">MENU</p>
        <SidebarItem to="/" icon="layout-dashboard" label="Dashboard" />
        <SidebarItem to="/transactions" icon="bank" label="Transactions" />
        <SidebarItem to="/stats" icon="bar-chart" label="Stats" />
  
        <p class="text-gray-400 text-xs px-4 mt-6">ACCOUNT</p>
        <SidebarItem to="/settings" icon="settings" label="Account Settings" />
        <SidebarItem to="/logout" icon="log-out" label="Sign Out" />
      </nav>
    </div>
  </template>
  
  <script setup lang="ts">
  import SidebarItem from '../components/SidebarItem.vue';
  </script>
  