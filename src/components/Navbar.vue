<template>
  <nav class="bg-blue-600 p-4 text-white">
    <ul class="flex gap-4">
      <li><router-link to="/">Dashboard</router-link></li>
      <li><router-link to="/transactions">Transactions</router-link></li>
      <li><router-link to="/stats">Stats</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
</script>

<style scoped>
nav a {
  text-decoration: none;
  color: inherit;
}
nav a.router-link-active {
  font-weight: bold;
}
</style>