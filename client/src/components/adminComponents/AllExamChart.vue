<template>
  <div class="card bg-base-100 shadow-lg p-6 rounded-xl">
    <h2 class="text-xl font-semibold text-base-content mb-4">All Results</h2>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
// On importe directement le composant Bar de vue-chartjs
import { Bar } from 'vue-chartjs';

// On importe les éléments nécessaires pour les enregistrer
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// On enregistre les composants de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Les données du graphique
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Teacher',
      backgroundColor: '#7B61FF',
      data: [60, 70, 80, 90, 110, 60, 80, 70, 60, 90, 80, 70],
      borderRadius: 6,
    },
    {
      label: 'Student',
      backgroundColor: '#FF7B61',
      data: [40, 50, 60, 50, 70, 40, 50, 60, 50, 70, 60, 50],
      borderRadius: 6,
    },
  ],
};

// Les options du graphique
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: 'easeOutQuart',
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};
</script>
