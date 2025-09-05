<template>
  <div class="card bg-base-100 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center">
    <h2 class="text-xl font-semibold text-base-content mb-4">Students</h2>
    <div class="relative w-40 h-40">
      <Doughnut :data="chartData" :options="chartOptions" />
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-lg font-bold">15000</span>
        <span class="text-sm text-gray-500">Total</span>
      </div>
    </div>
    <div class="mt-5 flex gap-4">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full" style="background-color: #7B61FF;"></span>
        <span class="text-sm">Male</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full" style="background-color: #FF7B61;"></span>
        <span class="text-sm">Female</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
// On importe directement le composant Doughnut
import { Doughnut } from "vue-chartjs";

// Enregistrement des composants de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Les données du graphique
const chartData = {
  labels: ["Male", "Female"],
  datasets: [
    {
      backgroundColor: ["#7B61FF", "#FF7B61"],
      data: [8000, 7000],
      borderWidth: 0
    }
  ]
};

// Les options du graphique
const chartOptions = {
  responsive: true,
  cutout: "75%",
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1500,
    easing: "easeOutElastic"
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true // Active les tooltips au survol
    }
  }
};
</script>
