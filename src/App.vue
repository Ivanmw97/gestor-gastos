<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar lateral -->
    <Sidebar v-if="!isAuthRoute" />
    
    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col">
      <div class="p-6 lg:p-6 flex-1 overflow-y-auto" :class="{ 'pl-16 lg:pl-6': !isAuthRoute }">
        <router-view @open-modal="showModal = true" />
      </div>
    </div>
  </div>

  <!-- Modal Global -->
  <Modal v-if="!isAuthRoute" :isOpen="showModal" title="Añadir Transacción" @close="showModal = false" />
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from './store/user';
import { useTransactionStore } from './store/transactions';
import Sidebar from './components/Sidebar.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAuthRoute = computed(() => route.path === '/auth');

const showModal = ref(false);

const transactionStore = useTransactionStore();

const userStore = useUserStore();
const isLoading = computed(() => userStore.isLoading);

onMounted(async () => {
  await userStore.initialize();
});

onMounted(() => {
  transactionStore.loadTransactions();
});
</script>
