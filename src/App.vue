<template>
  <Navbar />
  <router-view />

  <Dashboard @open-modal="showModal = true" />

  <!-- Usar el componente Modal -->
  <Modal :isOpen="showModal" title="Añadir Transacción" @close="showModal = false">
    <p>Contenido del modal aquí...</p>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Modal from './components/TransactionModal.vue';

const showModal = ref(false);
</script>
