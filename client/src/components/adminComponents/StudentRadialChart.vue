<template>
  <div class="card bg-base-100 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center">
    <h2 class="text-xl font-semibold text-base-content mb-4">Students</h2>
    <div class="relative w-40 h-40">
      <Doughnut :data="chartData" :options="chartOptions" />
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <span class="text-lg font-bold">{{ students.length }}</span>
          <span class="text-sm text-gray-500">Total</span>
        </div>
      </div>
    </div>
    <div class="mt-5 flex gap-4 flex-wrap justify-center">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#FF6384]"></span>
        <span class="text-sm">Male</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#6C77FF]"></span>
        <span class="text-sm">Female</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#00C0A3]"></span>
        <span class="text-sm">Private</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { storeToRefs } from "pinia";
import useStudentStore from "@/stores/studentStore";

// Enregistrement des composants de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const studentStore = useStudentStore();
const { students } = storeToRefs(studentStore);

// Calculs dynamiques du nombre d'étudiants par genre
const maleCount = computed(() => students.value.filter((stu) => stu.gender === "Man").length);
const femaleCount = computed(() => students.value.filter((stu) => stu.gender === "Woman").length);

// Les données du graphique
const chartData = computed(() => ({
  labels: ["Male", "Female"],
  datasets: [
    {
      // Ordre des couleurs ajusté: Rouge pour Male, Violet pour Female, Vert pour Private
      backgroundColor: ["#FF6384", "#6C77FF"],
      data: [700, 800],
      borderWidth: 0,
    },
  ],
}));

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
      display: false, // La légende est gérée manuellement dans le template
    },
    tooltip: {
      enabled: true,
    },
  },
};
</script>

<style scoped>
/* Supprimez le style .total-students-circle si vous l'aviez, il n'est plus nécessaire. */
</style>
