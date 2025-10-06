<template>
  <div class="p-6 md:p-10 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Notifications</h1>

    <div v-if="notifications.length === 0" class="text-center text-gray-500">
      You have no notifications at the moment.
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="bg-white shadow-lg rounded-2xl p-4 border-l-4 border-blue-500 hover:shadow-xl transition"
      >
        <div class="flex justify-between items-center mb-1">
          <h2 class="font-semibold text-lg">{{ notif.title }}</h2>
          <span class="text-gray-400 text-sm">{{ formatDate(notif.date) }}</span>
        </div>
        <p class="text-gray-700">{{ notif.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Exemple de données fictives
const notifications = ref([]);

onMounted(() => {
  // Ici tu peux récupérer les notifications réelles via ton API
  notifications.value = [
    {
      id: 1,
      title: "Appeal Response",
      message: "Your grade appeal for Mathematics has been reviewed. Check your updated result.",
      date: "2025-10-01T14:30:00Z",
    },
    {
      id: 2,
      title: "New Announcement",
      message: "The schedule for next week's exams has been published.",
      date: "2025-10-03T09:00:00Z",
    },
  ];
});

// Formater la date en version lisible
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};
</script>

<style scoped>
/* Optionnel : effet hover sur chaque notification */
</style>
