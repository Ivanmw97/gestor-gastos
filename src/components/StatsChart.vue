<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
          data: [500, 300], // Reemplazar con datos dinámicos
          backgroundColor: ['#4CAF50', '#F44336'],
        }],
      },
    });
  }
});
</script>

<style scoped>
.chart-container {
  width: 300px;
  height: 300px;
}
</style>
