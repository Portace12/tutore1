<template>
  <div class="card bg-base-100 shadow-xl p-6 rounded-2xl">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-base-content mb-4 md:mb-0">
        Gestion des Recours Étudiants
      </h2>
      <div class="flex items-center space-x-4">
        <span class="badge badge-lg badge-secondary font-bold p-6">
          {{ pendingRecoursesCount }} recours en attente
        </span>
        <select v-model="filter" class="select select-bordered select-sm">
          <option value="all">Tous les recours</option>
          <option value="pending">En attente</option>
          <option value="read">Traités</option>
        </select>
      </div>
    </div>

    <div v-if="filteredRecourses.length > 0" class="space-y-4">
      <div
        v-for="recourse in filteredRecourses"
        :key="recourse.id"
        class="alert shadow-lg transition-transform duration-300 transform hover:scale-[1.01]"
        :class="{
          'alert-info': !recourse.read,
          'bg-base-200 opacity-70': recourse.read,
        }"
      >
        <div class="flex items-center w-full">
          <svg
            v-if="!recourse.read"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div class="ml-4 flex-1">
            <p class="font-bold text-base-content">
              Recours de : {{ recourse.studentName }}
            </p>
            <p class="text-sm text-base-content/80 mt-1">
              **Objet :** {{ recourse.subject }}
            </p>
            <p class="text-sm text-base-content/60 mt-2">
              Reçu le {{ recourse.date }}
            </p>
          </div>

          <div class="flex space-x-2">
            <button @click="respondToRecourse(recourse.id)" class="btn btn-sm btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <span>Répondre</span>
            </button>
            <button @click="markAsTreated(recourse.id)" class="btn btn-sm btn-ghost tooltip" :data-tip="recourse.read ? 'Archivé' : 'Marquer comme traité'" :disabled="recourse.read">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Aucun recours ne correspond à votre filtre.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const filter = ref("all");

// Données fictives des recours
const recourses = ref([
  {
    id: 1,
    studentName: "Julien Dubois",
    subject: "Contestation de la note de l'examen de mathématiques",
    date: "il y a 2 heures",
    read: false,
  },
  {
    id: 2,
    studentName: "Marie Leblanc",
    subject: "Demande de réévaluation du projet de physique",
    date: "Hier",
    read: false,
  },
  {
    id: 3,
    studentName: "Lucas Martin",
    subject: "Question sur le calendrier des examens finaux",
    date: "3 jours plus tôt",
    read: true,
  },
  {
    id: 4,
    studentName: "Léa Petit",
    subject: "Absence justifiée à la dernière séance de cours",
    date: "il y a 1 semaine",
    read: false,
  },
]);

// Filtrer les recours en fonction de l'état
const filteredRecourses = computed(() => {
  if (filter.value === "pending") {
    return recourses.value.filter((r) => !r.read);
  } else if (filter.value === "read") {
    return recourses.value.filter((r) => r.read);
  }
  return recourses.value;
});

// Compter les recours en attente
const pendingRecoursesCount = computed(() =>
  recourses.value.filter((r) => !r.read).length
);

// Marquer un recours comme traité
const markAsTreated = (id) => {
  const recourse = recourses.value.find((r) => r.id === id);
  if (recourse) {
    recourse.read = true;
  }
};

// Gérer la réponse au recours (placeholder)
const respondToRecourse = (id) => {
  alert(
    `Vous allez répondre au recours #${id}. Cette action ouvrirait une page de formulaire.`
  );
  // Logique pour naviguer vers une page de réponse ou ouvrir une modale
  // par exemple : router.push(`/recours/${id}/repondre`);
};
</script>

<style scoped>
/* Pas de style spécifique nécessaire, Tailwind et DaisyUI gèrent tout. */
</style>
