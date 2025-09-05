<template>
  <div class="flex flex-col flex-1 bg-base-200 p-4 sm:p-6 rounded-2xl min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-base-content leading-tight">
        Créer une annonce
      </h1>
      <p class="mt-2 text-lg text-base-content/70">
        Utilisez ce formulaire pour publier des annonces à l'ensemble de l'établissement.
      </p>
    </header>

    <div class="card bg-base-100 shadow-xl p-6 rounded-2xl mb-8">
      <h2 class="text-2xl font-bold text-base-content mb-4">Nouvelle annonce</h2>
      <form @submit.prevent="publishAnnouncement" class="space-y-4">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Titre de l'annonce</span>
          </label>
          <input
            v-model="newAnnouncement.title"
            type="text"
            placeholder="Ex: Réunion du personnel..."
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-base font-semibold text-base-content/80"
              >Contenu de l'annonce</span
            >
          </label>
          <textarea
            v-model="newAnnouncement.content"
            class="textarea textarea-bordered h-32 w-full rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Décrivez en détail le sujet, les dates, les lieux et toutes les informations importantes."
            required
          ></textarea>
          <label class="label">
            <span class="label-text-alt text-base-content/60"
              >Ajoutez le plus de détails possible pour une communication claire.</span
            >
          </label>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.66-2.555a1 1 0 01.398-.752l5.065-3.376a1 1 0 000-1.506L9.66 8.524a1 1 0 01.398-.752l.66-2.555z"
              />
            </svg>
            <span>Publier l'annonce</span>
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-base-100 shadow-xl p-6 rounded-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-base-content">Annonces récentes</h2>
        <span class="badge badge-lg badge-primary">{{ announcements.length }} Annonces</span>
      </div>
      <div class="space-y-4">
        <div v-if="announcements.length > 0" class="space-y-4">
          <div
            v-for="announcement in sortedAnnouncements"
            :key="announcement.id"
            class="card card-compact bg-base-200 shadow-md"
          >
            <div class="card-body">
              <h3 class="card-title text-xl font-bold">{{ announcement.title }}</h3>
              <p class="text-base-content/80">{{ announcement.content }}</p>
              <div class="flex justify-between items-center text-sm text-base-content/60 mt-2">
                <span>Publié le {{ announcement.date }}</span>
                <div class="flex space-x-2">
                  <button
                    @click="editAnnouncement(announcement)"
                    class="btn btn-ghost btn-xs btn-circle tooltip"
                    data-tip="Modifier"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteAnnouncement(announcement.id)"
                    class="btn btn-ghost btn-xs btn-circle text-error tooltip"
                    data-tip="Supprimer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
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
            <span>Aucune annonce n'a été publiée pour le moment.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// État réactif pour la nouvelle annonce
const newAnnouncement = ref({
  title: "",
  content: "",
});

// État réactif pour la liste des annonces existantes
const announcements = ref([
  {
    id: 1,
    title: "Conférence annuelle de l'université",
    content: "L'événement se tiendra le 25 octobre. Des invités spéciaux seront présents.",
    date: "15 août 2025",
  },
  {
    id: 2,
    title: "Rappel : Fermeture du campus le 1er septembre",
    content: "Le campus sera fermé toute la journée en raison d'un jour férié.",
    date: "19 août 2025",
  },
]);

// Fonction pour trier les annonces par date (la plus récente en premier)
const sortedAnnouncements = computed(() => {
  return [...announcements.value].sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Fonction pour publier une nouvelle annonce
const publishAnnouncement = () => {
  if (newAnnouncement.value.title && newAnnouncement.value.content) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newId =
      announcements.value.length > 0 ? Math.max(...announcements.value.map((a) => a.id)) + 1 : 1;

    announcements.value.push({
      id: newId,
      title: newAnnouncement.value.title,
      content: newAnnouncement.value.content,
      date: formattedDate,
    });

    // Réinitialiser le formulaire
    newAnnouncement.value.title = "";
    newAnnouncement.value.content = "";
  }
};

// Fonction pour supprimer une annonce
const deleteAnnouncement = (id) => {
  if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
    announcements.value = announcements.value.filter((a) => a.id !== id);
  }
};

// Fonction pour éditer une annonce (pourrait ouvrir une modale par exemple)
const editAnnouncement = (announcement) => {
  alert(`Fonctionnalité d'édition pour : "${announcement.title}"`);
  // Logique pour l'édition à implémenter ici (ex: ouvrir une modale avec le formulaire pré-rempli)
};
</script>

<style scoped>
/* Aucun style spécifique nécessaire car nous utilisons des classes utilitaires de Tailwind et DaisyUI. */
</style>
