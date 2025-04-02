<template>
  <router-link
    :to="to"
    class="flex items-center gap-3 px-2 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
    :class="{ 'bg-blue-600 !text-white': isActive }"
    @click="handleClick"
  >
    <component 
      :is="icon" 
      class="h-5 w-5 text-blue-500" 
      :class="{ 'text-white': isActive }" 
    />
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import type { LucideIcon } from 'lucide-vue-next';

const props = defineProps<{
  to: string;
  icon: LucideIcon;
  label: string;
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.to);

// Inject the close function from parent
const closeSidebar = inject('closeSidebar') as () => void;

const handleClick = () => {
  if (closeSidebar) {
    closeSidebar();
  }
};
</script>
  
  
  