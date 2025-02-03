<template>
  <div v-if="modalStore.isOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <slot></slot>
      <div class="flex justify-end mt-4">
        <button @click="modalStore.closeModal()" class="bg-red-500 text-white px-4 py-2 rounded-md">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useModalStore } from '../store/modal';

// Usar el store de Pinia
const modalStore = useModalStore();

defineProps({
  title: String
});
</script>

  