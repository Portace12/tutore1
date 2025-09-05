<template>
  <div class="container mx-auto p-4 bg-base-100 text-base-content min-h-screen rounded">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Courses</h1>
      <button class="btn btn-primary">Add a course</button>
    </div>

    <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="course in courses" :key="course.id" class="card bg-base-200 shadow-xl w-full">
        <div class="card-body">
          <h2 class="card-title text-base-content">{{ course.name }}</h2>
          <p class="text-sm text-gray-500">
            <span class="font-semibold">Professeur :</span> {{ course.professor }}
          </p>
          <p class="text-sm text-gray-500">
            <span class="font-semibold">Étudiants :</span> {{ course.students }}
          </p>
          <div class="badge badge-outline mt-2">{{ course.faculty }}</div>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary btn-sm">View</button>
            <button class="btn btn-accent btn-sm">Update</button>
            <button class="btn btn-error btn-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Aucun cours n'est enregistré pour le moment.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const courses = ref([
  {
    id: 1,
    name: 'Introduction à l\'intelligence artificielle',
    professor: 'Dr. Jeanne Dubois',
    students: 45,
    faculty: 'Sciences et Technologies'
  },
  {
    id: 2,
    name: 'Droit constitutionnel avancé',
    professor: 'Mme. Claire Martin',
    students: 60,
    faculty: 'Droit et Économie'
  },
  {
    id: 3,
    name: 'Histoire de l\'art moderne',
    professor: 'M. Luc Perrin',
    students: 22,
    faculty: 'Arts et Sciences Sociales'
  },
  {
    id: 4,
    name: 'Programmation Web avec Vue.js',
    professor: 'Dr. Alice Dupont',
    students: 75,
    faculty: 'Sciences et Technologies'
  },
  {
    id: 5,
    name: 'Économie comportementale',
    professor: 'M. Thomas Lecocq',
    students: 38,
    faculty: 'Droit et Économie'
  },
  {
    id: 6,
    name: 'Sociologie urbaine',
    professor: 'Mme. Hélène Leroy',
    students: 31,
    faculty: 'Arts et Sciences Sociales'
  }
]);
</script>

<style scoped>
/* Pas de style CSS nécessaire car tout est géré par Tailwind et DaisyUI. */
</style>
