<template>
  <div class="flex justify-between items-center mb-4">
    <button @click="previousMonth" class="btn btn-ghost btn-square">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <h2 class="text-xl font-semibold text-base-content">
      {{ currentMonthName }} {{ currentYear }}
    </h2>
    <button @click="nextMonth" class="btn btn-ghost btn-square">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <div class="grid grid-cols-7 text-center text-sm font-medium text-base-content/60 mb-2">
    <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
  </div>

  <div class="grid grid-cols-7 gap-1">
    <div v-for="n in startDayOfWeek" :key="'empty-' + n" class="aspect-square"></div>

    <button
      v-for="day in daysInMonth"
      :key="day"
      class="aspect-square btn btn-ghost rounded-full flex items-center justify-center p-0 text-sm"
      :class="{ 'btn-primary': isToday(day), 'border-2 border-primary': isToday(day) }"
    >
      {{ day }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const date = ref(new Date());

const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const currentMonthName = computed(() => date.value.toLocaleString("fr-FR", { month: "long" }));
const currentYear = computed(() => date.value.getFullYear());

const daysInMonth = computed(() => {
  const year = date.value.getFullYear();
  const month = date.value.getMonth() + 1;
  return new Date(year, month, 0).getDate();
});

const startDayOfWeek = computed(() => {
  const d = new Date(date.value.getFullYear(), date.value.getMonth(), 1).getDay();
  return d === 0 ? 6 : d - 1;
});

const nextMonth = () => {
  date.value = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 1);
};

const previousMonth = () => {
  date.value = new Date(date.value.getFullYear(), date.value.getMonth() - 1, 1);
};

const isToday = (day) => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === date.value.getMonth() &&
    today.getFullYear() === date.value.getFullYear()
  );
};
</script>

<style scoped>
/* Aucun style spécifique nécessaire car nous utilisons des classes utilitaires de Tailwind. */
</style>
