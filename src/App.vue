<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar lateral -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col">
      <div class="p-6 flex-1 overflow-y-auto">
        <router-view @open-modal="showModal = true" />
      </div>
    </div>
  </div>

  <!-- Modal Global -->
  <Modal :isOpen="showModal" title="Añadir Transacción" @close="showModal = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './components/TransactionModal.vue';
import Sidebar from './components/Sidebar.vue';

const showModal = ref(false);
</script>
