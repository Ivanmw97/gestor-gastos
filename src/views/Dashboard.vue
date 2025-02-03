<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="mt-4">
      <p><strong>Balance:</strong> {{ balance }}</p>
      <p><strong>Ingresos:</strong> {{ totalIncome }}</p>
      <p><strong>Gastos:</strong> {{ totalExpense }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '../store/transactions';

const store = useTransactionStore();
const { balance, totalIncome, totalExpense } = storeToRefs(store);
</script>
