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
import { onMounted } from 'vue';
import { useTransactionStore } from './store/transactions';
import Sidebar from './components/Sidebar.vue';
import { ref } from 'vue';

const showModal = ref(false);

const transactionStore = useTransactionStore();

onMounted(() => {
  transactionStore.loadTransactions();
});
</script>