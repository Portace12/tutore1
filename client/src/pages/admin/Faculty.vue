<template>
  <div>
  <div class="flex flex-col lg:flex-row h-screen w-full">
    <div class="flex-1 p-5 w-full lg:w-1/2">
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 class="text-4xl font-extrabold text-base-content tracking-tight">Faculties</h1>
          <p class="mt-2 text-lg text-base-content/70">
            Explore and manage the different faculties of your establishment
          </p>
        </div>
        <button class="btn btn-primary mt-4 md:mt-0 shadow-lg" @click="handleClick">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Add a faculty</span>
        </button>
      </header>

      <!-- Faculties grid -->
      <div
        v-if="faculties.length > 0"
        class="grid gap-6 transition-all duration-300"
        :class="[
          details
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        ]"
      >
        <div
          v-for="faculty in faculties"
          :key="faculty.id"
          class="card bg-base-200 shadow-xl border border-base-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
        >
          <div class="card-body p-6">
            <h2 class="card-title text-base-content text-xl font-semibold">
              {{ faculty.nom_faculte }}
            </h2>
            <p class="text-base-content/80 mt-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-primary flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="font-medium">Campus :</span>
              {{ faculty.location }}
            </p>
            <div class="card-actions justify-end mt-4">
              <router-link
                class="btn btn-sm btn-outline btn-success"
                :to="{
                  name: 'FacultyDetail',
                  params: { facultyName: faculty.nom_faculte },
                  query: { id: faculty.id },
                }"
              >
                View
              </router-link>
              <button class="btn btn-sm btn-outline btn-primary" @click="handleUpdate(faculty)">
                Update
              </button>
              <button class="btn btn-sm btn-outline btn-error" @click="handleDelete(faculty.id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center p-16 h-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 text-base-content/30 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.172 19.172a4 4 0 01-5.656-5.656L15.657 3.96a2 2 0 112.828 2.828L7.029 17.029z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.828 7.172a4 4 0 00-5.656-5.656L3.96 15.657a2 2 0 102.828 2.828L17.828 7.172z"
          />
        </svg>
        <p class="text-xl font-semibold text-base-content/70 mb-2">No faculties found</p>
        <p class="text-sm text-base-content/50">
          Start by adding your first faculty using the button above.
        </p>
      </div>
    </div>

  </div>
    <!-- Modals -->
    <FacultyAdd v-model="isModalOpen" title="Add Faculty" />
    <FacultyUpdate
      v-model="isUpdateModalOpen"
      title="Update Faculty"
      :selectedFaculty="selectedFaculty"
    />
      </div>
</template>

<script setup>
import FacultyAdd from "@/components/FacultyAdd.vue";
import FacultyUpdate from "@/components/FacultyUpdate.vue";
import { useFacultyStore } from "@/stores/facultyStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const details = ref(false);
const useFaculty = useFacultyStore();
const { fetchAll, deleteFaculty } = useFaculty;
const { faculties } = storeToRefs(useFaculty);

const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const selectedFaculty = ref(null);

const handleClick = () => {
  isModalOpen.value = true;
};

const handleDelete = async (id) => {
  await deleteFaculty(id);
};

const handleUpdate = (faculty) => {
  selectedFaculty.value = faculty; // ✅ on passe directement l’objet
  isUpdateModalOpen.value = true;
};

onMounted(() => {
  fetchAll();
});
</script>
