<template>
    <router-link
      :to="to"
      class="flex items-center px-4 py-3 transition hover:bg-gray-800"
      active-class="bg-blue-600 text-white"
    >
      <component
        :is="iconComponent"
        v-if="iconComponent"
        class="w-5 h-5 mr-3 text-gray-400"
        :name="icon"
      />
      <span>{{ label }}</span>
    </router-link>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import * as LucideIcons from 'lucide-vue-next';
  
  const props = defineProps<{
    to: string;
    icon: string;
    label: string;
  }>();
  
  const iconComponent = computed(() => {
    return (LucideIcons as Record<string, any>)[props.icon] || null;
  });
  </script>
  
  
  