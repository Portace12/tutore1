<template>
  <div class="card bg-base-100 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center">
    <h2 class="text-xl font-semibold text-base-content mb-4">Students</h2>

    <!-- Doughnut -->
    <div class="relative w-40 h-40">
      <Doughnut :data="chartData" :options="chartOptions" />
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-lg font-bold">{{ students.length }}</span>
        <span class="text-sm text-gray-500">Total</span>
      </div>
    </div>

    <!-- Légende -->
    <div class="mt-5 flex gap-4 flex-wrap justify-center">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#FF6384]"></span>
        <span class="text-sm">Male ({{ maleCount }})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#6C77FF]"></span>
        <span class="text-sm">Female ({{ femaleCount }})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-[#00C0A3]"></span>
        <span class="text-sm">Private ({{ privateCount }})</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { storeToRefs } from "pinia";
import useStudentStore from "@/stores/studentStore";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const studentStore = useStudentStore();
const { students } = storeToRefs(studentStore);
console.log(students.value.filter((s)=> s.genre?.toLowerCase()=== "woman").length);


// Comptages dynamiques
const maleCount = computed(
  () => students.value.filter((s) => s.genre?.toLowerCase() === "man").length
);
const femaleCount = computed(
  () => students.value.filter((s) => s.genre?.toLowerCase() === "women").length
);
const privateCount = computed(
  () => students.value.filter((s) => s.genre?.toLowerCase() === "private").length
);

// Données du graphique
const chartData = computed(() => {
  // fallback : au moins 1 pour que la couleur reste visible
  const m = maleCount.value || 1;
  const f = femaleCount.value || 1;
  const p = privateCount.value || 1;

  return {
    labels: ["Male", "Female", "Private"],
    datasets: [
      {
        data: [m, f, p],
        backgroundColor: ["#FF6384", "#6C77FF", "#00C0A3"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };
});

// Options Chart.js
const chartOptions = {
  responsive: true,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        // affiche valeur brute si >0, sinon "0"
        label: (ctx) => {
          const realValues = [maleCount.value, femaleCount.value, privateCount.value];
          return `${ctx.label}: ${realValues[ctx.dataIndex]}`;
        },
      },
    },
  },
};
</script>
